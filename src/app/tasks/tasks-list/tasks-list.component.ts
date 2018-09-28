import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskModel} from '../task.model';
import {Subscription} from 'rxjs';
import {TaskService} from '../task.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SharedService} from '../../shared/shared.service';
import {MatDialog} from '@angular/material';
import {DeleteConfirmComponent} from '../../shared/delete-confirm.component';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

  componentSubs: Subscription[] = [];
  employeeMode = false;
  isLoading = true;
  loadId: string;
  tasksArr: TaskModel[] = [];
  tasksEmployeeName: string;

  constructor(private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute,
              private sharedService: SharedService,
              private dialog: MatDialog) { }

  ngOnInit() {
    const urlPath = this.route.snapshot.url[0].path;
    this.componentSubs.push(this.route.params
      .subscribe((params: Params) => {
      this.tasksEmployeeName = params['employeeName'];
    }));
    this.componentSubs.push(this.sharedService.isLoadingChanged
      .subscribe(result => this.isLoading = result));
    this.componentSubs.push(this.sharedService.isEmployeeModeChanged
      .subscribe(result => this.employeeMode = result));
    if (urlPath === 'myTasks') {
      this.initTasksByEmployee();
    } else {
      this.initTasksByLoadId();
    }
  }

  initTasksByLoadId () {
    this.componentSubs.push(this.route.params.subscribe((params: Params) => {
      this.loadId = params['loadId'];
    }));
    this.componentSubs.push(this.taskService.tasksChanged.subscribe((tasks: TaskModel[]) => {
      this.tasksArr = tasks;
      this.taskService.recountUnscheduledTasks(tasks, this.loadId);
    }));
    this.taskService.fetchTasksByLoadId(this.loadId);
  }

  initTasksByEmployee() {
    this.componentSubs.push(this.taskService.tasksChangedForEmployee.subscribe((tasks: TaskModel[]) => {
      this.tasksArr = tasks;
      setTimeout(() => {
        this.sharedService.isEmployeeModeChanged.next(true);
      }, 300);
    }));
    this.taskService.fetchTasksForEmployeeName(this.tasksEmployeeName);
  }

  onAddNewTask() {
    this.router.navigate(['new', this.loadId], {relativeTo: this.route});
  }

  onBackToList() {
    this.router.navigate(['/loads']);
  }

  onDeleteAllTasks() {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      data: {
        numberTasks: this.tasksArr.length
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksArr.forEach(tsk => {
          this.taskService.deleteTask(tsk.id);
        });
      } else {
        dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }

}
