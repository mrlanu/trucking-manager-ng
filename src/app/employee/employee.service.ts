import {EmployeeModel} from './employee.model';
import {Observable, Subject, Subscription} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class EmployeeService {

  private allEmployees: EmployeeModel[] = [];
  employeesChange = new Subject<EmployeeModel[]>();
  employeeChange = new Subject<EmployeeModel>();
  serviceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAllEmployees() {
    this.serviceSubs.push(this.db
      .collection('employee')
      .snapshotChanges()
      .pipe(map(employeesArray => {
        return employeesArray.map(employee => {
          return {
            ...employee.payload.doc.data()
          };
        });
      })).subscribe((employees: EmployeeModel[]) => {
        this.allEmployees = employees;
        this.employeesChange.next([...this.allEmployees]);
    }, err => console.log('Error - fetchAllEmployees() ' + err)));
  }

  fetchEmployeeByEmail(email: string) {
    const resultArr: EmployeeModel[] = [];
    this.db.collection('employee', ref => ref.where('email', '==', email))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          resultArr.push({
            ...doc.data() as EmployeeModel
          });
        });
        this.employeeChange.next(resultArr[0]);
      });
  }

  getEmployeesByOccupation(occupation: string): Observable<any> {
    return this.db
      .collection('employee', ref => ref.where('occupation', '==', occupation))
      .valueChanges();
  }

  cancelAllSubscriptions() {
    this.serviceSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }

}
