import {LoadModel} from './load.model';
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {EmployeeService} from '../employee/employee.service';

@Injectable()
export class LoadService {

  private loadList: LoadModel[] = [];
  loadsChanged = new Subject<LoadModel[]>();

  constructor(private db: AngularFirestore,
              private employeeService: EmployeeService) {}

  fetchAvailableLoads() {
    this.db
      .collection('loads')
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
      }
    );
  }

  saveLoad(load: LoadModel) {
    this.db.collection('loads').add(load).then(result => {
      const id = result.id;
      this.db.doc(`loads/${id}`).update({id: id});
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

}
