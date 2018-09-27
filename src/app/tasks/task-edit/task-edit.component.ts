import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskModel} from '../task.model';
import {TaskService} from '../task.service';
import {Observable, Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeModel} from '../../employee/employee.model';
import {MatDialog} from '@angular/material';
import {AddressComponent} from './address.component';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {

  loadId: string;
  taskId: string;
  componentSubs: Subscription[] = [];
  taskEditForm: FormGroup;
  address: {
    address1: string,
    address2: string,
    city: string,
    state: string,
    zip: number
  };
  editMode = false;
  showForm = true;
  kindArr: string[] = ['Pick Up', 'Delivery'];
  drivers: Observable<EmployeeModel[]>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.componentSubs.push(this.route.params.subscribe((params: Params) => {
      this.taskId = params['taskId'];
      this.loadId = params['loadId'];
      if (this.taskId) {
        this.editMode = true;
      }
      this.initForm();
    }));
    this.drivers = this.taskService.getDrivers();
  }

  initForm() {

    let id = '';
    let loadId = '';
    let kind = '';
    let date: Date;
    let time = '';
    let employee = '';
    let isCompleted = false;
    let description = '';

    /*this.address = new FormGroup({
      'address1': new FormControl('', Validators.required),
      'address2': new FormControl(''),
      'city': new FormControl({value: '', disabled: true}, Validators.required),
      'state': new  FormControl('', Validators.required),
      'zip': new FormControl('', Validators.required)
    });*/

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
      // 'address': this.address,
      'employee': new FormControl(employee),
      'isCompleted': new FormControl(isCompleted),
      'description': new FormControl(description)
    });
  }

  onSubmit() {
    const task = {...this.taskEditForm.value, 'address': this.address};
    if (this.editMode) {
      this.taskService.updateTask(task);
    } else {
      this.taskService.saveTask(task);
    }
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

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
