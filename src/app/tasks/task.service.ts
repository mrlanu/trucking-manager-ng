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
import {EmployeeModel} from '../employee/employee.model';

@Injectable()
export class TaskService {

  private tasks: TaskModel[] = [];
  private crossDocks: CrossTask[] = [];
  tasksChanged = new Subject<TaskModel[]>();
  tasksChangedForEmployee = new Subject<TaskModel[]>();
  numberOfTasksChangedForEmployee = new Subject<number>();
  crossDocksChanges = new Subject<any>();
  unscheduledTasksChange = new Subject<UnscheduledTasks>();
  // private unscheduledTasks: UnscheduledTasks;
  componentSubs: Subscription[] = [];
  taskForEditChange = new Subject<TaskModel>();

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
      });
    });
  }

  updateTask(task: TaskModel) {
    this.db.doc(`tasks/${task.id}`).set(task).then(conf => {
    });
  }

  updateTaskStatusIsCompleted(task: TaskModel) {
    let compl = 1;
    let fetchLoadSubs: Subscription;
    fetchLoadSubs = this.loadService.loadByIdChange.subscribe(load => {
      this.db.doc(`tasks/${task.id}`).update({isCompleted: true}).then(conf => {
      });
      const [city, kind] = [task.crossTask.address.city, task.kind];
      if (!load.warehouse) {
        console.log('Fuck');
        this.tasks.forEach(tsk => {
          if (tsk.isCompleted && tsk.crossTask.address.city === city && tsk.kind === kind) {
            compl++;
          }
        });
      }
      if (load.task.pickUpCount === compl) {
        console.log('URA');
      }
      console.log(load);
      fetchLoadSubs.unsubscribe();
    });
    this.loadService.fetchLoadById(task.loadId);
  }


  deleteTask(task: TaskModel) {
    this.db.doc(`tasks/${task.id}`).delete().then(result => {
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
    this.unscheduledTasksChange.next({
      'unscheduledPickUp': load.task.unscheduledPickUpCount,
      'unscheduledDelivery': load.task.unscheduledDeliveryCount
    });
    this.loadService.updateLoad(load);
  }

  addLog(loadId: string, description: string, employee: EmployeeModel) {
    this.loadLogService.addLog(loadId, description, employee);
  }

  cancelAllSubscriptions() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }

}
