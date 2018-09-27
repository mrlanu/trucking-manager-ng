import {AuthData} from './auth-data.model';
import {Subject, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoadService} from '../load/load.service';
import {EmployeeService} from '../employee/employee.service';
import {TaskService} from '../tasks/task.service';
import {EmployeeModel} from '../employee/employee.model';

@Injectable()
export class AuthService {

  private loggedInEmployee: EmployeeModel;
  private isAuthenticated = false;
  authChange = new Subject<boolean>();
  serviceSubs: Subscription[] = [];

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private loadService: LoadService,
              private employeeService: EmployeeService,
              private taskService: TaskService) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.serviceSubs.push(this.employeeService.employeeChange.subscribe(employee => {
          this.loggedInEmployee = employee;
        }));
        this.employeeService.fetchEmployeeByEmail(user.email);
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/loads']);
      } else {
        this.cancelAllServicesSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // console.log(result);
      })
      .catch(error => {
         console.log(error);
      });
  }

  login(authData: AuthData) {
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(loggedInUser => {
        // console.log(loggedInUser);
      })
      .catch(error => {
        console.log(error);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

  cancelAllServicesSubscriptions() {
    this.loadService.cancelAllSubscriptions();
    this.employeeService.cancelAllSubscriptions();
    this.taskService.cancelAllSubscriptions();
    this.serviceSubs.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
