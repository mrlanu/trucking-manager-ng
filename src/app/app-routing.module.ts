import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LoadEditComponent} from './load/load-edit/load-edit.component';
import {LoadListComponent} from './load/load-list/load-list.component';
import {EmployeeEditComponent} from './employee/employee-edit/employee-edit.component';
import {TaskEditComponent} from './task/task-edit/task-edit.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signUp', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'editLoad', component: LoadEditComponent},
  {path: 'editLoad/:id', component: LoadEditComponent},
  {path: 'editTask/:id', component: TaskEditComponent},
  {path: 'listLoad', component: LoadListComponent},
  {path: 'employee', component: EmployeeEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
