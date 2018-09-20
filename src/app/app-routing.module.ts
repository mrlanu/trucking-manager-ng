import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LoadEditComponent} from './load/load-edit/load-edit.component';
import {LoadListComponent} from './load/load-list/load-list.component';
import {EmployeeEditComponent} from './employee/employee-edit/employee-edit.component';
import {TaskEditComponent} from './tasks/task-edit/task-edit.component';
import {TasksComponent} from './tasks/tasks.component';
import {TaskStartComponent} from './tasks/task-start/task-start.component';
import {TasksListComponent} from './tasks/tasks-list/tasks-list.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signUp', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'editLoad', component: LoadEditComponent},
  {path: 'editLoad/:id', component: LoadEditComponent},
  {path: 'listLoad', component: LoadListComponent},
  {path: 'employee', component: EmployeeEditComponent},
  {path: 'tasks', component: TasksComponent, children: [
      {path: ':id', component: TasksListComponent, children: [
          {path: ':taskId', component: TaskEditComponent}
        ]},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
