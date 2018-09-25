import {Injectable} from '@angular/core';
import {TaskModel} from './task.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {EmployeeService} from '../employee/employee.service';
import {LoadService} from '../load/load.service';
import {LoadModel} from '../load/load.model';
import {SharedService} from '../shared/shared.service';

@Injectable()
export class TaskService {

  private tasks: TaskModel[] = [];
  tasksChanged = new Subject<TaskModel[]>();
  numberOfTasksChangedForEmployee = new Subject<number>();
  tasksChangedForEmployee = new Subject<TaskModel[]>();
  subscriptions: Subscription;

  constructor(private db: AngularFirestore,
              private employeeService: EmployeeService,
              private loadService: LoadService,
              private sharedService: SharedService) {}

  fetchTasksByLoadId(loadId: string) {
    this.sharedService.isLoadingChanged.next(true);
    this.subscriptions = this.db
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
      });
  }

  fetchTasksByEmployeeName(employeeName: string) {
    this.sharedService.isLoadingChanged.next(true);
    this.subscriptions = this.db
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
      });
  }

  saveTask(task: TaskModel) {
    this.db.collection('tasks').add(task).then(result => {
      const id = result.id;
      this.db.doc(`tasks/${id}`).update({id: id});
    });
  }

  updateTask(task: TaskModel) {
    this.db.doc(`tasks/${task.id}`).set(task);
  }

  updateTaskStatusIsCompleted(taskId: string) {
    this.db.doc(`tasks/${taskId}`).update({isCompleted: true});
  }


  deleteTask(taskId: string) {
    this.db.doc(`tasks/${taskId}`).delete().then(result => {
    }).catch(err => {
      console.log(err);
    });
  }

  cancelAllSubscriptions() {
    this.subscriptions.unsubscribe();
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
    this.loadService.updateLoad(load);
  }

}
