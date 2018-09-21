import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './navigation/header/header.component';
import {SidenavListComponent} from './navigation/sidenav-list/sidenav-list.component';
import {LoadListComponent} from './load/load-list/load-list.component';
import {LoadEditComponent} from './load/load-edit/load-edit.component';
import {LoadService} from './load/load.service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {EmployeeEditComponent} from './employee/employee-edit/employee-edit.component';
import {EmployeeService} from './employee/employee.service';
import {TaskEditComponent} from './tasks/task-edit/task-edit.component';
import {TaskService} from './tasks/task.service';
import {TasksComponent} from './tasks/tasks.component';
import {TasksListComponent} from './tasks/tasks-list/tasks-list.component';
import {TaskItemComponent} from './tasks/tasks-list/task-item/task-item.component';
import {TaskStartComponent} from './tasks/task-start/task-start.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    SidenavListComponent,
    LoadListComponent,
    LoadEditComponent,
    EmployeeEditComponent,
    TaskEditComponent,
    TasksComponent,
    TasksListComponent,
    TaskItemComponent,
    TaskStartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [LoadService, EmployeeService, TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
