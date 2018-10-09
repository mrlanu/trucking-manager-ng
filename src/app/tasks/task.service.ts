import {Injectable} from '@angular/core';
import {CrossTask, TaskModel, UnscheduledTasks} from './task.model';
import {AngularFirestore, QuerySnapshot} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {EmployeeService} from '../employee/employee.service';
import {LoadService} from '../load/load.service';
import {LoadModel} from '../load/load.model';
import {UiService} from '../shared/ui.service';
import {LoadLogService} from '../load/load-log/load-log.service';

@Injectable()
export class TaskService {

  private tasks: TaskModel[] = [];
  private crossDocks: CrossTask[] = [];
  tasksChanged = new Subject<TaskModel[]>();
  tasksChangedForEmployee = new Subject<TaskModel[]>();
  numberOfTasksChangedForEmployee = new Subject<number>();
  crossDocksChanges = new Subject<any>();
  private unscheduledTasks: UnscheduledTasks;
  componentSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private employeeService: EmployeeService,
              private loadService: LoadService,
              private sharedService: UiService,
              private loadLogService: LoadLogService) {}

  fetchTasksByLoadId(loadId: string) {
    this.sharedService.isLoadingChanged.next(true);
    this.componentSubs.push(this.db
      .collection('tasks', ref => ref
        .where('loadId', '==', loadId)
        .orderBy('kind', 'desc')
        .orderBy('date'))
      .valueChanges()
      .pipe(map(tasks => {
        return tasks.map(task => {
          return {...task};
        });
      }))
      .subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
        this.tasksChanged.next([...this.tasks]);
        this.sharedService.isLoadingChanged.next(false);
      }, err => console.log('Error - fetchTasksByLoadId(loadId: string) ' + err)));
  }

  fetchTasksForEmployeeName(employeeName: string) {
    this.sharedService.isLoadingChanged.next(true);
    this.componentSubs.push(this.db
      .collection('tasks', ref => ref
        .where('employee', '==', employeeName)
        .where('isCompleted', '==', false)
        .orderBy('date')
        .orderBy('kind', 'desc'))
      .valueChanges()
      .pipe(map(tasks => {
        return tasks.map(task => {
          return {...task};
        });
      }))
      .subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
        this.numberOfTasksChangedForEmployee.next(tasks.length);
        this.tasksChangedForEmployee.next([...this.tasks]);
        this.sharedService.isLoadingChanged.next(false);
      }, err => console.log('Error - fetchTasksForEmployeeName(employeeName: string) ' + err)));
  }

  fetchAllCrossDocks() {
    this.componentSubs.push(this.db
      .collection('crossDocks')
      .get()
      .pipe(map((querySnapshot: QuerySnapshot<any>) => {
        return querySnapshot.docs.map(queryDoc => {
          return {...queryDoc.data()};
        });
      }))
      .subscribe(crossDocks => {
        this.crossDocks = crossDocks;
        this.crossDocksChanges.next([...this.crossDocks]);
      }));
  }

  getCrossTask(city: string): CrossTask {
    let result: CrossTask = {
      address: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: null
      },
      isCompleted: false
    };
    if (city) {
        result = this.crossDocks.find(item => {
        return item.address.city === city;
      });
    }
    return {...result};
  }


  saveTask(task: TaskModel) {
    this.db.collection('tasks').add(task).then(result => {
      const id = result.id;
      this.db.doc(`tasks/${id}`).update({id: id}).then(conf => {
        this.loadLogService.addLog(task.loadId, 'Task has been added', this.getLoggedInEmployeeName());
      });
    });
  }

  updateTask(task: TaskModel) {
    this.db.doc(`tasks/${task.id}`).set(task).then(conf => {
      this.loadLogService.addLog(task.loadId, 'Task has been edited', this.getLoggedInEmployeeName());
    });
  }

  updateTaskStatusIsCompleted(taskId: string) {
    const task = this.getTaskById(taskId);
    this.db.doc(`tasks/${taskId}`).update({isCompleted: true}).then(conf => {
      this.loadLogService.addLog(task.loadId, 'Task has been completed', this.getLoggedInEmployeeName());
    });
  }


  deleteTask(taskId: string) {
    const task = this.getTaskById(taskId);
    this.db.doc(`tasks/${taskId}`).delete().then(result => {
      this.loadLogService.addLog(task.loadId, 'Task has been deleted', this.getLoggedInEmployeeName());
    }).catch(err => {
      console.log(err);
    });
  }

  getDrivers(): Observable<any> {
    return this.employeeService.getEmployeesByOccupation('driver');
  }

  getTaskById(id: string): TaskModel {
    return this.tasks.find((tsk: TaskModel) => {
      return tsk.id === id;
    });
  }

  recountUnscheduledTasks(tasks: TaskModel[], loadId: string) {
    const load: LoadModel = this.loadService.getLoadById(loadId);
    let scheduledPickUps = 0;
    let scheduledDelivery = 0;
    tasks.forEach(task => {
      if (task.employee) {
        if (task.kind === 'Pick Up') {
          scheduledPickUps ++;
        } else if (task.kind === 'Delivery') {
          scheduledDelivery ++;
        }
      }
    });
    load.task.unscheduledPickUpCount = load.task.pickUpCount - scheduledPickUps;
    load.task.unscheduledDeliveryCount = load.task.deliveryCount - scheduledDelivery;
    this.unscheduledTasks = {
      'unscheduledPickUp': load.task.unscheduledPickUpCount,
      'unscheduledDelivery': load.task.unscheduledDeliveryCount
    };
    this.loadService.updateLoad(load);
  }

  getNumbersUnscheduledTasks(): UnscheduledTasks {
    return {...this.unscheduledTasks};
  }

  getLoggedInEmployeeName(): string {
    return `${this.employeeService.loggedInEmployee.firstName} ${this.employeeService.loggedInEmployee.secondName}`;
  }

  cancelAllSubscriptions() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
