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
  drivers: any[] = [];

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
        this.tasks.forEach(t => {
          this.addTask(t);
        });
      });
    });
    this.taskService.fetchTasksByLoadId(this.load.id);
    this.taskService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });
    this.initForm();
  }

  ngOnDestroy() {
    this.taskService.cancelAllSubscriptions();
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  initForm() {
    const tasks = new FormArray([]);

    this.tasksForm = new FormGroup({
      'tasks': tasks
    });
  }

  addTask(tsk: TaskModel) {
    (<FormArray>this.tasksForm.get('tasks')).push(
      new FormGroup({
        'id': new FormControl(tsk.id),
        'loadId': new FormControl(tsk.loadId),
        'kind': new FormControl(tsk.kind),
        'date': new FormControl(tsk.date.toDate()),
        'time': new FormControl(tsk.time),
        'address': new FormControl(tsk.address),
        'employee': new FormControl(tsk.employee),
        'isCompleted': new FormControl(tsk.isCompleted),
        'description': new FormControl(tsk.description)
      })
    );
  }

  onSubmit() {
    const allTasks: TaskModel[] = this.tasksForm.get('tasks').value;
    allTasks.forEach(tsk => {
      if (tsk.id) {
        this.taskService.updateTask(tsk);
      } else {
        this.taskService.saveTask(tsk);
      }
    });
    this.router.navigate(['listLoad']);
  }

  onAddTask() {
    (<FormArray>this.tasksForm.get('tasks')).push(
      new FormGroup({
        'id': new FormControl(null),
        'loadId': new FormControl(this.load.id),
        'kind': new FormControl(null),
        'date': new FormControl(null),
        'time': new FormControl(null),
        'address': new FormControl(null),
        'employee': new FormControl(null),
        'isCompleted': new FormControl(false),
        'description': new FormControl(null)
      })
    );
  }

  onDeleteTask(index: number) {
    const taskForDel: TaskModel = this.tasksForm.get('tasks').value[index];
    if (taskForDel.id) {
      this.taskService.deleteTask(taskForDel);
      this.clearFormArray(<FormArray>this.tasksForm.get('tasks'));
    } else {
      (<FormArray>this.tasksForm.get('tasks')).removeAt(index);
    }

  }

  clearFormArray (formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  onCancel() {
    this.router.navigate(['/listLoad']);
  }

}
