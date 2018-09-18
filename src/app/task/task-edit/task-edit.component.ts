import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {LoadService} from '../../load/load.service';
import {LoadModel} from '../../load/load.model';
import {TaskModel} from '../task.model';
import {TaskService} from '../task.service';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {EmployeeModel} from '../../employee/employee.model';

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
          'time': new FormControl(tsk.time),
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

  addTask(tsk: TaskModel) {
    (<FormArray>this.tasksForm.get('tasks')).push(
      new FormGroup({
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

  onAddTask() {
    (<FormArray>this.tasksForm.get('tasks')).push(
      new FormGroup({
        'kind': new FormControl(null),
        'date': new FormControl(null),
        'time': new FormControl(null),
        'address': new FormControl(null),
        'employee': new FormControl(null),
        'isCompleted': new FormControl(null),
        'description': new FormControl(null)
      })
    );
  }

  onDeleteTask(index: number) {
    (<FormArray>this.tasksForm.get('tasks')).removeAt(index);
  }

}
