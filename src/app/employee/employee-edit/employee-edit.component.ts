import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployeeService} from '../employee.service';
import {Subscription} from 'rxjs';
import {EmployeeModel} from '../employee.model';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {

  employeesChangedSubscription: Subscription;
  allEmployees: EmployeeModel[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeesChangedSubscription = this.employeeService
      .employeesChanged.subscribe((employees: EmployeeModel[]) => {
        this.allEmployees = employees;
      });
    this.employeeService.fetchAllEmployees();
  }

  ngOnDestroy() {
    if (this.employeesChangedSubscription) {
      this.employeesChangedSubscription.unsubscribe();
    }
  }

}
