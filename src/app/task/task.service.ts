import {Injectable} from '@angular/core';
import {TaskModel} from './task.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';

@Injectable()
export class TaskService {

  private tasks: TaskModel[] = [];
  tasksChanged = new Subject<TaskModel[]>();
  subscriptions: Subscription;

  constructor(private db: AngularFirestore) {}

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

  stertiAddTask() {
    this.db.collection('tasks').add({
      'loadId': '',
      'kind': 'pickUp',
      'date': new Date(),
      'address': 'Addison, IL',
      'employee': 'Serhiy Khabenyuk',
      'isCompleted': false,
      'description': 'HZ'
    });
  }

}
