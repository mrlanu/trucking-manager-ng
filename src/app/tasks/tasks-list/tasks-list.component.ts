import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskModel} from '../task.model';
import {Subscription} from 'rxjs';
import {TaskService} from '../task.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

  loadId: string;
  tasksArr: TaskModel[] = [];
  tasksChangeSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.loadId = params['id'];
      console.log(params);
    });
    this.tasksChangeSubscription = this.taskService.tasksChanged.subscribe((tasks: TaskModel[]) => {
      this.tasksArr = tasks;
    });
    this.taskService.fetchTasksByLoadId(this.loadId);
  }


  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.tasksChangeSubscription) {
      this.tasksChangeSubscription.unsubscribe();
    }
  }



}
