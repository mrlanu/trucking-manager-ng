import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskModel} from '../task.model';
import {Subscription} from 'rxjs';
import {TaskService} from '../task.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SharedService} from '../../shared/shared.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

  isLoadingDate = true;
  loadId: string;
  tasksArr: TaskModel[] = [];
  tasksChangeSubscription: Subscription;
  isLoadingSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.isLoadingSubscription = this.sharedService.isLoadingChanged.subscribe(result => this.isLoadingDate = result);
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.loadId = params['loadId'];
    });
    this.tasksChangeSubscription = this.taskService.tasksChanged.subscribe((tasks: TaskModel[]) => {
      this.tasksArr = tasks;
      this.taskService.recountUnscheduledTasks(tasks, this.loadId);
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
    if (this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
    this.taskService.cancelAllSubscriptions();
  }

  onAddNewTask() {
    this.router.navigate(['new', this.loadId], {relativeTo: this.route});
  }

  onBackToList() {
    this.router.navigate(['/loads']);
  }

  onDeleteAllTasks() {
    this.tasksArr.forEach(tsk => {
      this.taskService.deleteTask(tsk.id);
    });
  }

}
