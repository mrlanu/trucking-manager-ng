import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskModel} from '../task.model';
import {TaskService} from '../task.service';
import {Observable, Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeModel} from '../../employee/employee.model';

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
  editMode = false;
  showForm = true;
  kindArr: string[] = ['Pick Up', 'Delivery'];
  drivers: Observable<EmployeeModel[]>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService) { }

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
    let address = '';
    let employee = '';
    let isCompleted = false;
    let description = '';

    if (this.editMode) {
      const task: TaskModel = this.taskService.getTaskById(this.taskId);
      id = task.id;
      loadId = task.loadId;
      kind = task.kind;
      date = task.date.toDate();
      time = task.time;
      address = task.address;
      employee = task.employee;
      isCompleted = task.isCompleted;
      description = task.description;
    } else {
      loadId = this.loadId;
    }

    this.taskEditForm = new FormGroup({
      'id': new FormControl(id),
      'loadId': new FormControl(loadId),
      'kind': new FormControl(kind, Validators.required),
      'date': new FormControl(date, Validators.required),
      'time': new FormControl(time),
      'address': new FormControl(address, Validators.required),
      'employee': new FormControl(employee),
      'isCompleted': new FormControl(isCompleted),
      'description': new FormControl(description)
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.taskService.updateTask(this.taskEditForm.value);
    } else {
      this.taskService.saveTask(this.taskEditForm.value);
    }
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  onCancelAddNewTask() {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
