import {AngularFirestore, QuerySnapshot} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {LogModel} from './log.model';
import {EmployeeModel} from '../../employee/employee.model';
import {CrossTask, TaskModel} from '../../tasks/task.model';
import {AddressModel} from '../../shared/address.model';

@Injectable()
export class LoadLogService {

  private logArr: LogModel[] = [];
  logChange = new Subject<any>();
  serviceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  fetchLogByLoadId(loadId: string) {
    this.serviceSubs.push(this.db.collection('loadLog', ref => ref
      .where('loadId', '==', loadId)
      .orderBy('date', 'desc'))
      .get()
      .pipe(map((querySnapshot: QuerySnapshot<any>) => {
        return querySnapshot.docs.map(queryDoc => {
          return {...queryDoc.data()};
        });
      }))
      .subscribe(log => {
        this.logArr = log;
        this.logChange.next([...this.logArr]);
      }));
  }

  addLog(loadId: string, description: string, employee: EmployeeModel) {
    const nameFromEmployeeModel = `${employee.firstName} ${employee.secondName}`;
    const log = {
      date: new Date(),
      description: description,
      employee: nameFromEmployeeModel,
      loadId: loadId
    };
    this.db.collection('loadLog').add(log).then(conf => {
      this.fetchLogByLoadId(log.loadId);
    });
  }

  // compare what was changed in the edited Task for Log
  compareEditedTask(taskBefore: TaskModel, taskAfter: TaskModel): string {
    const fieldsForCompare =
      ['kind', 'date', 'time', 'address', 'employee', 'isCompleted', 'description', 'crossTask'];
    const formattedWords =
      ['Kind ', 'Date ', 'Time ', 'Address ', 'Driver ', 'unused', 'Description ', 'Cross task '];
    const result: string[] = [];
    for (let i = 0; i < fieldsForCompare.length; i++) {
      if (taskBefore[fieldsForCompare[i]] === taskAfter[fieldsForCompare[i]]) {
        continue;
      } else {
        if (fieldsForCompare[i] === 'crossTask') {
          if (Object.is(taskBefore[fieldsForCompare[i]].address.address1,
            taskAfter[fieldsForCompare[i]].address.address1) ||
            Object.is(taskBefore[fieldsForCompare[i]].address.city,
              taskAfter[fieldsForCompare[i]].address.city)) {
            continue;
          }
        }
        result.push(formattedWords[i]);
      }
    }
    return result.toString();
  }

  cancelAllSubscriptions() {
    this.serviceSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
