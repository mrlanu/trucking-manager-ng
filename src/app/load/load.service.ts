import {LoadModel} from './load.model';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {EmployeeService} from '../employee/employee.service';

@Injectable()
export class LoadService {

  private loadList: LoadModel[] = [];
  serviceSubs: Subscription[] = [];
  loadsChanged = new Subject<LoadModel[]>();
  loadSavedConfirm = new Subject<string>();

  constructor(private db: AngularFirestore,
              private employeeService: EmployeeService) {}

  fetchAvailableLoads() {
    this.serviceSubs.push(this.db
      .collection('loads', ref => ref.orderBy('date', 'desc'))
      .snapshotChanges()
      .pipe(map(docsArray => {
        return docsArray.map(dc => {
          return {
            ...dc.payload.doc.data()
          };
        });
      })).subscribe((loads: LoadModel[]) => {
        this.loadList = loads;
        this.loadsChanged.next([...this.loadList]);
      }, err => console.log('Error - fetchAvailableLoads() ' + err)
    ));
  }

  saveLoad(load: LoadModel) {
    this.db.collection('loads').add(load).then(result => {
      const id = result.id;
      this.db.doc(`loads/${id}`).update({id: id});
      this.loadSavedConfirm.next(id);
      });
  }

  updateLoad(load: LoadModel) {
    this.db.doc(`loads/${load.id}`).set(load);
  }

  getLoadById(id: string) {
    return this.loadList.find(load => load.id === id);
  }

  getDispatches(): Observable<any> {
    return this.employeeService.getEmployeesByOccupation('dispatch');
  }

  cancelAllSubscriptions() {
    this.serviceSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
