import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TaskModel} from '../../task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../task.service';
import {SharedService} from '../../../shared/shared.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {DeleteConfirmComponent} from '../../../shared/delete-confirm.component';

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
              private sharedService: SharedService,
              private dialog: MatDialog) { }

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
    const dialogRef = this.dialog.open(DeleteConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(taskId);
      } else {
        dialogRef.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }

}
