import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignUpComponent} from './auth/signup/sign-up.component';
import {LoadEditComponent} from './load/load-edit/load-edit.component';
import {LoadListComponent} from './load/load-list/load-list.component';
import {EmployeeEditComponent} from './employee/employee-edit/employee-edit.component';
import {TaskEditComponent} from './tasks/task-edit/task-edit.component';
import {TasksComponent} from './tasks/tasks.component';
import {TasksListComponent} from './tasks/tasks-list/tasks-list.component';
import {LoadComponent} from './load/load.component';
import {AuthGuard} from './auth/auth.guard';
import {LoadLogComponent} from './load/load-log/load-log.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'login', component: LoginComponent},
  {path: 'employee', component: EmployeeEditComponent, canActivate: [AuthGuard]},
  {path: 'loads', component: LoadComponent, canActivateChild: [AuthGuard], children: [
      {path: '', component: LoadListComponent},
      {path: 'new', component: LoadEditComponent},
      {path: 'edit/:id', component: LoadEditComponent},
      {path: 'log/:id', component: LoadLogComponent},
    ]},
  {path: 'tasks', component: TasksComponent, canActivateChild: [AuthGuard], children: [
      {path: 'myTasks/:employeeName', component: TasksListComponent},
      {path: ':loadId', component: TasksListComponent, children: [
          {path: 'edit/:taskId', component: TaskEditComponent},
          {path: 'new/:loadId', component: TaskEditComponent}
        ]},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
