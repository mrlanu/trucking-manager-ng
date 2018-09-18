import {Injectable} from '@angular/core';
import {TaskModel} from './task.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {EmployeeService} from '../employee/employee.service';
import {EmployeeModel} from '../employee/employee.model';

@Injectable()
export class TaskService {

  private tasks: TaskModel[] = [];
  tasksChanged = new Subject<TaskModel[]>();
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

  cancelAllSubscriptions() {
    this.subscriptions.unsubscribe();
  }

  getDrivers(): Observable<any> {
    return this.employeeService.getEmployeesByOccupation('driver');
  }

}
