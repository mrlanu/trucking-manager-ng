import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LoadEditComponent} from './load/load-edit/load-edit.component';
import {LoadListComponent} from './load/load-list/load-list.component';
import {EmployeeEditComponent} from './employee/employee-edit/employee-edit.component';
import {TaskEditComponent} from './tasks/task-edit/task-edit.component';
import {TasksComponent} from './tasks/tasks.component';
import {TasksListComponent} from './tasks/tasks-list/tasks-list.component';
import {LoadComponent} from './load/load.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'loads', component: LoadComponent, children: [
      {path: '', component: LoadListComponent},
      {path: 'new', component: LoadEditComponent},
      {path: 'edit/:id', component: LoadEditComponent},
    ]},
  {path: 'employee', component: EmployeeEditComponent},
  {path: 'tasks', component: TasksComponent, children: [
      {path: 'myTasks', component: TasksListComponent},
      {path: ':loadId', component: TasksListComponent, children: [
          {path: 'edit/:taskId', component: TaskEditComponent},
          {path: 'new/:loadId', component: TaskEditComponent}
        ]},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
