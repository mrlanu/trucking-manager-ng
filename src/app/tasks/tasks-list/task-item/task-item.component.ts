import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TaskModel} from '../../task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../task.service';
import {SharedService} from '../../../shared/shared.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit, OnDestroy {

  @Input() task: TaskModel;
  employeeMode = false;
  componentSubs: Subscription[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.componentSubs.push(this.sharedService.isEmployeeModeChanged.subscribe(result => this.employeeMode = result));
  }

  onEditTask(id: string) {
    this.router.navigate(['edit', id], {relativeTo: this.route});
  }

  onCompleteTask(taskId: string) {
    this.taskService.updateTaskStatusIsCompleted(taskId);
  }

  onDeleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

  ngOnDestroy(): void {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }

}
