import {EmployeeModel} from './employee.model';
import {Subject} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class EmployeeService {

  private allEmployees: EmployeeModel[] = [];
  employeesChanged = new Subject<EmployeeModel[]>();

  constructor(private db: AngularFirestore) {}

  fetchAllEmployees() {
    this.db
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
        this.employeesChanged.next([...this.allEmployees]);
    });
  }

  convertEmployeeToLastName(employees: EmployeeModel[]): string[] {
    return employees.map(employee => {
      return employee.firstName + ' ' + employee.secondName;
    });
  }

}
