import {Injectable} from '@angular/core';
import {EmployeeService} from '../employee/employee.service';
import {Subject} from 'rxjs';

@Injectable()
export class SharedService {

  dispatchesChanged = new Subject<string[]>();

  constructor(private employeeService: EmployeeService) {}

  selectAndConvertEmployeesByOccupation(occupation: string) {
    if (this.employeeService.getAllEmployees().length === 0) {
      this.employeeService.fetchAllEmployees();
      console.log('Fuck');
    }
    const employeesArray = this.employeeService.getAllEmployees();
    const result = employeesArray
      .filter(employee => {
        return employee.occupation === occupation;
      })
      .map(employee => {
        return employee.firstName + ' ' + employee.secondName;
      });
    this.dispatchesChanged.next(result);
  }
}
