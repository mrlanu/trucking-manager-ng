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

  componentSubs: Subscription[] = [];
  allEmployees: EmployeeModel[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.componentSubs.push(this.employeeService
      .employeesChange.subscribe((employees: EmployeeModel[]) => {
        this.allEmployees = employees;
      }));
    this.employeeService.fetchAllEmployees();
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }

}
