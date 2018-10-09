import {AuthData} from './auth-data.model';
import {Subject, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoadService} from '../load/load.service';
import {EmployeeService} from '../employee/employee.service';
import {TaskService} from '../tasks/task.service';
import {EmployeeModel} from '../employee/employee.model';
import {LoadLogService} from '../load/load-log/load-log.service';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable()
export class AuthService {

  private loggedInEmployee: EmployeeModel;
  employeeChange = new Subject<EmployeeModel>();
  private isAuthenticated = false;
  authChange = new Subject<boolean>();
  serviceSubs: Subscription[] = [];

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private router: Router,
              private loadService: LoadService,
              private employeeService: EmployeeService,
              private taskService: TaskService,
              private loadLogService: LoadLogService) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.fetchEmployeeByEmail(user.email);
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

  fetchEmployeeByEmail(email: string) {
    const resultArr: EmployeeModel[] = [];
    this.serviceSubs.push(this.db.collection('employee', ref => ref.where('email', '==', email))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          resultArr.push({
            ...doc.data() as EmployeeModel
          });
        });
        this.loggedInEmployee = resultArr[0];
        this.employeeChange.next({...this.loggedInEmployee});
      }));
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
    this.loadLogService.cancelAllSubscriptions();
    this.serviceSubs.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
