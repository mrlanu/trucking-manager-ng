import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadModel} from '../load.model';
import {TaskModel} from '../../tasks/task.model';
import {LogModel} from '../load-log/log.model';
import {Subscription} from 'rxjs';
import {LoadLogService} from '../load-log/load-log.service';
import {TaskService} from '../../tasks/task.service';
import {LoadService} from '../load.service';

@Component({
  selector: 'app-load-manager',
  templateUrl: './load-manager.component.html',
  styleUrls: ['./load-manager.component.css']
})
export class LoadManagerComponent implements OnInit, OnDestroy {

  load: LoadModel;
  loadId: string;
  tasks: TaskModel[] = [];
  log: LogModel[] = [];
  componentSubs: Subscription[] = [];

  constructor(private router: Router,
              private routes: ActivatedRoute,
              private loadService: LoadService,
              private taskService: TaskService,
              private logService: LoadLogService) { }

  ngOnInit() {
    this.componentSubs.push(this.routes.params
      .subscribe(params => {
      this.loadId = params['loadId'];
      this.load = this.loadService.getLoadById(this.loadId);
    }));
    this.componentSubs.push(this.taskService.tasksChanged
      .subscribe((tasks: TaskModel[]) => {
      this.tasks = tasks;
    }));
    this.componentSubs.push(this.logService.logChange.subscribe((log: LogModel[]) => {
      this.log = log;
      console.log(this.log);
    }));
    this.taskService.fetchTasksByLoadId(this.loadId);
    this.logService.fetchLogByLoadId(this.loadId);
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }



}
