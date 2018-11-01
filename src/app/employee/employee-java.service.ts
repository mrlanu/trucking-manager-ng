import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {EmployeeModel} from './employee.model';

@Injectable()
export class EmployeeJavaService {

  employeesChange = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  fetchAllEmployees() {
    this.httpClient.get('http://localhost:8080/employees').subscribe((empl: any) => {
      const employees: EmployeeModel[] = empl.content;
      console.log(employees);
      this.employeesChange.next(employees);
    });
  }

}
