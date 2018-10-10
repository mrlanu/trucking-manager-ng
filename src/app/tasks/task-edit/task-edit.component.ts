import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CrossTask, TaskModel, UnscheduledTasks} from '../task.model';
import {TaskService} from '../task.service';
import {Observable, Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeModel} from '../../employee/employee.model';
import {MatDialog, MatSelectChange} from '@angular/material';
import {AddressComponent} from './address.component';
import {AddressModel} from '../../shared/address.model';
import {UiService} from '../../shared/ui.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {

  loadId: string;
  taskId: string;
  loggedInEmployee: EmployeeModel;
  componentSubs: Subscription[] = [];
  taskEditForm: FormGroup;
  address: AddressModel;
  canScheduleTask = true;
  availableTasksForSchedule: UnscheduledTasks;
  editMode = false;
  showForm = true;
  kindArr: string[] = ['Pick Up', 'Delivery'];
  crossDocksArr: CrossTask[] = [];
  isCrossDock = false;
  drivers: Observable<EmployeeModel[]>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private dialog: MatDialog,
              private sharedService: UiService,
              private authService: AuthService) { }

  ngOnInit() {
    this.componentSubs.push(this.route.params
      .subscribe((params: Params) => {
      this.taskId = params['taskId'];
      this.loadId = params['loadId'];
      if (this.taskId) {
        this.editMode = true;
      }
      this.initForm();
      this.availableTasksForSchedule = this.taskService.getNumbersUnscheduledTasks();
    }));
    this.drivers = this.taskService.getDrivers();
    this.componentSubs.push(this.taskService.crossDocksChanges
      .subscribe(crossDock => {
      this.crossDocksArr = crossDock;
    }));
    this.loggedInEmployee = this.authService.getLoggedInEmployee();
    this.taskService.fetchAllCrossDocks();
  }

  initForm() {

    let id = '';
    let loadId = '';
    let kind = '';
    let date: Date;
    let time = '';
    let employee = '';
    let isCompleted = false;
    let crossTaskCity = '';
    let description = '';

    if (this.editMode) {
      const task: TaskModel = this.taskService.getTaskById(this.taskId);
      this.address = task.address;
      id = task.id;
      loadId = task.loadId;
      kind = task.kind;
      date = task.date.toDate();
      time = task.time;
      employee = task.employee;
      isCompleted = task.isCompleted;
      if (task.crossTask.address.city) {
        crossTaskCity = task.crossTask.address.city;
        this.isCrossDock = true;
      }
      description = task.description;
      // this.address.setValue(task.address);
    } else {
      loadId = this.loadId;
    }

    this.taskEditForm = new FormGroup({
      'id': new FormControl(id),
      'loadId': new FormControl(loadId),
      'kind': new FormControl(kind, Validators.required),
      'date': new FormControl(date, Validators.required),
      'time': new FormControl(time),
      'employee': new FormControl(employee),
      'isCompleted': new FormControl(isCompleted),
      'crossTaskCity': new FormControl(crossTaskCity),
      'description': new FormControl(description)
    });
  }

  onSubmit() {
    // for clear crossTaskCity value if checkBox is unchecked
    if (!this.isCrossDock) {
      this.taskEditForm.patchValue({'crossTaskCity': undefined});
    }
    // get crossTask full address depend on City of crossDock
    const crossTask = this.taskService.getCrossTask(this.taskEditForm.value.crossTaskCity);
    // remove crossTaskCity FormControl from taskEditForm.value
    this.taskEditForm.removeControl('crossTaskCity');
    // create task either for saving or updating
    const task: TaskModel = {...this.taskEditForm.value, 'address': this.address, 'crossTask': crossTask};
    if (this.editMode) {
      this.taskService.addLog(task.loadId, `Task for ${task.kind} has been edited`, this.loggedInEmployee);
      this.taskService.updateTask(task);
    } else {
      this.taskService.addLog(task.loadId, `Task for ${task.kind} has been added`, this.loggedInEmployee);
      this.taskService.saveTask(task);
    }
    // navigate to LoadsListComponent
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  onCancelAddNewTask() {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  onAddAddress() {
    const dialogRef = this.dialog.open(AddressComponent, {
      width: '350px',
      data: {address: this.address}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.address = result;
      }
    });
  }

  onChangeKind(event: MatSelectChange) {
    this.canScheduleTask = true;
    switch (event.value) {
      case 'Pick Up': {
        if (this.availableTasksForSchedule.unscheduledPickUp === 0) {
          this.canScheduleTask = false;
          this.sharedService.openSnackBar('All Pick Ups has been scheduled.', '');
        }
        break;
      }
      case 'Delivery': {
        if (this.availableTasksForSchedule.unscheduledDelivery === 0) {
          this.canScheduleTask = false;
          this.sharedService.openSnackBar('All Deliveries has been scheduled', '');
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
