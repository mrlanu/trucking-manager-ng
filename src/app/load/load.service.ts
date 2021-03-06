import {LoadModel} from './load.model';
import {Injectable} from '@angular/core';
import {AngularFirestore, QuerySnapshot} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {EmployeeService} from '../employee/employee.service';
import {UiService} from '../shared/ui.service';
import {LoadLogService} from './load-log/load-log.service';
import {EmployeeModel} from '../employee/employee.model';

@Injectable()
export class LoadService {

  private loadList: LoadModel[] = [];
  serviceSubs: Subscription[] = [];
  loadsChanged = new Subject<LoadModel[]>();
  loadSavedConfirm = new Subject<string>();
  loadByIdChange = new Subject<LoadModel>();

  constructor(private db: AngularFirestore,
              private employeeService: EmployeeService,
              private uiService: UiService,
              private loadLogService: LoadLogService) {}

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
        this.uiService.isLoadingChanged.next(false);
      }, err => console.log('Error - fetchAvailableLoads() ' + err)
    ));
  }

  getAvailableLoads() {
    this.loadsChanged.next([...this.loadList]);
  }

  filterLoadsByWarehouse(warehouse: string) {
    const result: LoadModel[] = this.loadList.filter(load => load.warehouse === warehouse);
    this.loadsChanged.next(result);
  }

  saveLoad(load: LoadModel) {
    this.db.collection('loads').add(load).then(result => {
      const id = result.id;
      this.db.doc(`loads/${id}`).update({id: id}).then(conf => {
        this.loadSavedConfirm.next(id);
      });
    });
  }

  updateLoad(load: LoadModel) {
    this.db.doc(`loads/${load.id}`).set(load).then(conf => {
    });
  }

  getLoadById(id: string) {
    return this.loadList.find(load => load.id === id);
  }

  fetchLoadById(id: string) {
    let loadSub: Subscription;
     loadSub = this.db.doc(`loads/${id}`).get().subscribe(doc => {
      this.loadByIdChange.next(<LoadModel>doc.data());
      loadSub.unsubscribe();
    });
  }

  getDispatches(): Observable<any> {
    return this.employeeService.getEmployeesByOccupation('dispatch');
  }

  addLog(loadId: string, description: string, employee: EmployeeModel) {
    this.loadLogService.addLog(loadId, description, employee);
  }

  cancelAllSubscriptions() {
    this.serviceSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
