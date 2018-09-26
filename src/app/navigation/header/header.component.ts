import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskService} from '../../tasks/task.service';
import {Observable, Observer, Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {EmployeeModel} from '../../employee/employee.model';
import {EmployeeService} from '../../employee/employee.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuth = false;
  authenticatedEmployee: EmployeeModel;
  employeeGreeting: Observable<string>;
  myTasksCount: number;
  componentSubs: Subscription[] = [];

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private taskService: TaskService,
              private authService: AuthService,
              private employeeService: EmployeeService,
              private router: Router) { }

  ngOnInit() {
    this.componentSubs.push(this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
      if (this.isAuth) {
        this.componentSubs.push(this.employeeService.employeeChange
          .subscribe(employee => {
          this.authenticatedEmployee = employee;
          this.employeeGreeting = new Observable<string>((observer: Observer<string>) => {
            observer.next(employee.firstName);
          });
          this.taskService.fetchTasksForEmployeeName(`${employee.firstName} ${employee.secondName}`);
        }));
      }
    }));
    this.componentSubs.push(this.taskService.numberOfTasksChangedForEmployee
      .subscribe(number => {
      this.myTasksCount = number;
    }));
  }

  onSidenavToggle() {
    this.sidenavToggle.emit();
  }

  onLogOut() {
    this.authService.logout();
  }

  onTasksEmployee() {
    const employeeName = `${this.authenticatedEmployee.firstName} ${this.authenticatedEmployee.secondName}`;
    this.router.navigate(['tasks', 'myTasks', employeeName]);
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
