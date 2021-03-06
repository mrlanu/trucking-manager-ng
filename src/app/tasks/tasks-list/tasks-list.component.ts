import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TaskModel, UnscheduledTasks} from '../task.model';
import {Subscription} from 'rxjs';
import {TaskService} from '../task.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';
import {MatDialog} from '@angular/material';
import {DeleteConfirmComponent} from '../../shared/delete-confirm.component';
import {EmployeeModel} from '../../employee/employee.model';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

  @Input() loggedInEmployee: EmployeeModel;
  @Input() loadId: string;
  @Input() tasksArr: TaskModel[];
  availableTasksForSchedule: UnscheduledTasks;
  employeeMode = false;
  isLoading = false;
  tasksEmployeeName: string;
  componentSubs: Subscription[] = [];

  constructor(private taskService: TaskService,
              private router: Router,
              private route: ActivatedRoute,
              private uiService: UiService,
              private dialog: MatDialog) { }

  ngOnInit() {
    const urlPath = this.route.snapshot.url[0].path;
    if (urlPath === 'myTasks') {
      this.initTasksByEmployee();
    } else {
      this.componentSubs.push(this.taskService.unscheduledTasksChange
        .subscribe((unscheduledT: UnscheduledTasks) => {
          this.availableTasksForSchedule = unscheduledT;
        }));
    }
  }

  initTasksByEmployee() {
    this.employeeMode = true;
    this.componentSubs.push(this.route.params
      .subscribe((params: Params) => {
        this.tasksEmployeeName = params['employeeName'];
      }));
    this.componentSubs.push(this.taskService.tasksChangedForEmployee
      .subscribe((tasks: TaskModel[]) => {
        this.tasksArr = tasks;
      }));
    this.taskService.fetchTasksForEmployeeName(this.tasksEmployeeName);
  }

  onAddNewTask() {
    this.taskService.taskForEditChange.next(null);
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
        this.taskService.addLog(this.tasksArr[0].loadId, 'All tasks has been deleted', this.loggedInEmployee);
        this.tasksArr.forEach(task => {
          this.taskService.deleteTask(task);
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
