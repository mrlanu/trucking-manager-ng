import {Injectable} from '@angular/core';
import {TaskModel} from './task.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {EmployeeService} from '../employee/employee.service';

@Injectable()
export class TaskService {

  private tasks: TaskModel[] = [];
  tasksChanged = new Subject<TaskModel[]>();
  tasksChangedForEmployee = new Subject<TaskModel[]>();
  subscriptions: Subscription;

  constructor(private db: AngularFirestore,
              private employeeService: EmployeeService) {}

  fetchTasksByLoadId(loadId: string) {
    this.subscriptions = this.db
      .collection('tasks', ref => ref.where('loadId', '==', loadId))
      .valueChanges()
      .pipe(map(tasks => {
        return tasks.map(task => {
          return {...task};
        });
      }))
      .subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
        this.tasksChanged.next([...this.tasks]);
      });
  }

  fetchTasksByEmployeeName(employeeName: string) {
    this.subscriptions = this.db
      .collection('tasks', ref => ref.where('employee', '==', employeeName))
      .valueChanges()
      .pipe(map(tasks => {
        return tasks.map(task => {
          return {...task};
        });
      }))
      .subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
        this.tasksChangedForEmployee.next([...this.tasks]);
      });
  }

  addTask(task: TaskModel) {
    this.db.collection('tasks').add(task).then(result => {
      const id = result.id;
      this.db.doc(`tasks/${id}`).update({id: id});
    });
  }

  updateTask(task: TaskModel) {
    this.db.doc(`tasks/${task.id}`).set(task);
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

}
