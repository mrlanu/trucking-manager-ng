import { Component, OnInit } from '@angular/core';
import {EmployeeModel} from '../employee.model';
import {EmployeeJavaService} from '../employee-java.service';

@Component({
  selector: 'app-employeey-list',
  templateUrl: './employeey-list.component.html',
  styleUrls: ['./employeey-list.component.css']
})
export class EmployeeyListComponent implements OnInit {

  employees: EmployeeModel[] = [];

  constructor(private employeeJavaService: EmployeeJavaService) { }

  ngOnInit() {
    this.employeeJavaService.employeesChange.subscribe((empl: EmployeeModel[]) => {
      this.employees = empl;
    });
    this.employeeJavaService.fetchAllEmployees();
  }

}
