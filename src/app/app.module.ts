import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginComponent} from './auth/login/login.component';
import {SignUpComponent} from './auth/signup/sign-up.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { LoadComponent } from './load/load.component';
import {UiService} from './shared/ui.service';
import {AuthService} from './auth/auth.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {DeleteConfirmComponent} from './shared/delete-confirm.component';
import {AddressComponent} from './tasks/task-edit/address.component';
import { LoadLogComponent } from './load/load-log/load-log.component';
import {LoadLogService} from './load/load-log/load-log.service';
import { LoadManagerComponent } from './load/load-manager/load-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HeaderComponent,
    SidenavListComponent,
    LoadListComponent,
    LoadEditComponent,
    EmployeeEditComponent,
    TaskEditComponent,
    TasksComponent,
    TasksListComponent,
    TaskItemComponent,
    TaskStartComponent,
    LoadComponent,
    DeleteConfirmComponent,
    AddressComponent,
    LoadLogComponent,
    LoadManagerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [LoadService, EmployeeService, TaskService, UiService, AuthService, LoadLogService],
  bootstrap: [AppComponent],
  entryComponents: [DeleteConfirmComponent, AddressComponent]
})
export class AppModule { }
