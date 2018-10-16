import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CrossTask, TaskModel, UnscheduledTasks} from '../task.model';
import {TaskService} from '../task.service';
import {Observable, Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeModel} from '../../employee/employee.model';
import {MatDialog, MatSelectChange} from '@angular/material';
import {AddressComponent} from './address.component';
import {AddressModel} from '../../shared/address.model';
import {UiService} from '../../shared/ui.service';
import {LoadLogService} from '../../load/load-log/load-log.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {

  @Input() loggedInEmployee: EmployeeModel;
  @Input() loadId: string;
  taskEditForm: FormGroup;
  task: TaskModel;
  address: AddressModel;
  @Input() availableTasksForSchedule: UnscheduledTasks;
  editMode = false;
  showForm = false;
  canScheduleTask = true;
  isCrossDock = false;
  kindArr: string[] = ['Pick Up', 'Delivery'];
  crossDocksArr: CrossTask[] = [];
  drivers: Observable<EmployeeModel[]>;
  componentSubs: Subscription[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private logService: LoadLogService,
              private dialog: MatDialog,
              private sharedService: UiService) { }

  ngOnInit() {
    this.componentSubs.push(this.taskService.taskForEditChange
      .subscribe((task: TaskModel) => {
        if (task) {
          this.task = task;
          this.editMode = true;
        } else {
          this.task = null;
          this.editMode = false;
        }
        this.showForm = true;
        this.initForm();
      }));
    this.drivers = this.taskService.getDrivers();
    this.componentSubs.push(this.taskService.crossDocksChanges
      .subscribe(crossDock => {
      this.crossDocksArr = crossDock;
    }));
    this.taskService.fetchAllCrossDocks();
  }

  initForm() {
    this.address = null;
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
      const task = this.task;
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

    // override this.task for comparing the Date field
    // in this.logService.compareEditedTask(this.task, task);
    // because had a problem to compare Date & Timestamp
        if (!this.isCrossDock) {
          this.taskEditForm.patchValue({'crossTaskCity': undefined});
        }
        const crossTask = this.taskService.getCrossTask(this.taskEditForm.value.crossTaskCity);
        this.task = {...this.taskEditForm.value, 'address': this.address, 'crossTask': crossTask};
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
      const changes: string = this.logService.compareEditedTask(this.task, task);
      this.taskService.addLog(task.loadId, `Task has been edited. What: ${changes}`, this.loggedInEmployee);
      this.taskService.updateTask(task);
    } else {
      this.taskService.addLog(task.loadId, `Task for ${task.kind} has been added to ${task.employee}`, this.loggedInEmployee);
      this.taskService.saveTask(task);
    }
    this.showForm = false;
  }

  onCancelAddNewTask() {
    this.showForm = false;
    this.taskEditForm.reset();
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
