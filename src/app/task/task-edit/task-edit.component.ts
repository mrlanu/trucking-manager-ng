import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LoadService} from '../../load/load.service';
import {LoadModel} from '../../load/load.model';
import {TaskModel} from '../task.model';
import {TaskService} from '../task.service';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {

  load: LoadModel;
  tasks: TaskModel[] = [];
  routeSubscription: Subscription;
  taskSubscription: Subscription;
  kindArr = ['Pick Up', 'Delivery'];

  tasksForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private loadService: LoadService,
              private taskService: TaskService,
              private router: Router) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.load = this.loadService.getLoadById(params['id']);
      this.taskSubscription = this.taskService.tasksChanged.subscribe((tasks: TaskModel[]) => {
        this.tasks = tasks;
        this.initForm();
      });
    });
    this.taskService.fetchTasksByLoadId(this.load.id);
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  onCancel() {
    this.router.navigate(['/listLoad']);
  }

  initForm() {
    const loadId = this.load.id;
    const tasks = new FormArray([]);

    if (this.tasks.length > 0) {
      for (const tsk of this.tasks) {
        tasks.push(new FormGroup({
          'kind': new FormControl(tsk.kind),
          'date': new FormControl(tsk.date.toDate()),
          'address': new FormControl(tsk.address),
          'employee': new FormControl(tsk.employee),
          'isCompleted': new FormControl(tsk.isCompleted),
          'description': new FormControl(tsk.description)
        }));
      }
    }

    this.tasksForm = new FormGroup({
      'loadId': new FormControl(loadId),
      'tasks': tasks
    });
  }

}
