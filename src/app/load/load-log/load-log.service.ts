import {AngularFirestore, QuerySnapshot} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {LogModel} from './log.model';
import {EmployeeModel} from '../../employee/employee.model';

@Injectable()
export class LoadLogService {

  private logArr: LogModel[] = [];
  logChange = new Subject<any>();
  serviceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  fetchLogByLoadId(loadId: string) {
    this.serviceSubs.push(this.db.collection('loadLog', ref => ref.where('loadId', '==', loadId))
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

    });
  }

  cancelAllSubscriptions() {
    this.serviceSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
