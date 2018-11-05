import { Component, OnInit } from '@angular/core';
import {EmployeeModel} from '../employee.model';
import {EmployeeJavaService} from '../employee-java.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: EmployeeModel[] = [];

  constructor(private employeeJavaService: EmployeeJavaService) { }

  ngOnInit() {
    this.employeeJavaService.employeesChange.subscribe((empl: EmployeeModel[]) => {
      this.employees = empl;
    });
    this.employeeJavaService.fetchAllEmployees();
  }

}
