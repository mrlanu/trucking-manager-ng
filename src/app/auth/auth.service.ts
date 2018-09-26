import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoadService} from '../load/load.service';
import {EmployeeService} from '../employee/employee.service';
import {TaskService} from '../tasks/task.service';

@Injectable()
export class AuthService {

  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private loadService: LoadService,
              private employeeService: EmployeeService,
              private taskService: TaskService) {}

  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // console.log(result);
        this.authSuccessfully();
      })
      .catch(error => {
         console.log(error);
      });
  }

  login(authData: AuthData) {
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // console.log(result);
        this.authSuccessfully();
      })
      .catch(error => {
        console.log(error);
      });
  }

  logout() {
    this.cancelAllServicesSubscriptions();
    this.afAuth.auth.signOut().then(log => {
      this.isAuthenticated = false;
      this.authChange.next(false);
      this.router.navigate(['/login']);
    });
  }

  isAuth() {
    return this.isAuthenticated;
  }

  authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/loads']);
  }

  cancelAllServicesSubscriptions() {
    this.loadService.cancelAllSubscriptions();
    this.employeeService.cancelAllSubscriptions();
    this.taskService.cancelAllSubscriptions();
  }

}
