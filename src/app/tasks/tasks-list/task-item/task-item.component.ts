import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TaskModel} from '../../task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../task.service';
import {UiService} from '../../../shared/ui.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {DeleteConfirmComponent} from '../../../shared/delete-confirm.component';
import {EmployeeModel} from '../../../employee/employee.model';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit, OnDestroy {

  loggedInEmployee: EmployeeModel;
  @Input() task: TaskModel;
  employeeMode = false;
  componentSubs: Subscription[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private sharedService: UiService,
              private dialog: MatDialog,
              private authService: AuthService) { }

  ngOnInit() {
    this.componentSubs.push(this.sharedService.isEmployeeModeChanged
      .subscribe(result => this.employeeMode = result));
    this.loggedInEmployee = this.authService.getLoggedInEmployee();
  }

  onEditTask() {
    this.taskService.taskForEditChange.next(this.task);
  }

  onCompleteTask() {
    this.taskService.updateTaskStatusIsCompleted(this.task);
  }

  onDeleteTask() {
    const dialogRef = this.dialog.open(DeleteConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(this.task);
        this.taskService
          .addLog(this.task.loadId, `Task for ${this.task.kind} has been deleted for ${this.task.employee}`, this.loggedInEmployee);
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
