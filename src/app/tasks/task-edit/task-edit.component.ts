import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskModel} from '../task.model';
import {TaskService} from '../task.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {

  loadId: string;
  taskId: string;
  routeSubscription: Subscription;
  taskEditForm: FormGroup;
  editMode = false;
  showForm = true;
  kindArr: string[] = ['Pick Up', 'Delivery'];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.taskId = params['taskId'];
      this.loadId = params['loadId'];
    });
    if (this.taskId) {
      this.editMode = true;
    }
    this.initForm();
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
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
    console.log(loadId);
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

  onCancelAddNewTask() {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

}
