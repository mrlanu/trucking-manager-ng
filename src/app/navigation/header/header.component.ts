import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskService} from '../../tasks/task.service';
import {TaskModel} from '../../tasks/task.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  myTasks: TaskModel[] = [];
  myTaskSubs: Subscription;

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private tasksService: TaskService) { }

  ngOnInit() {
    this.myTaskSubs = this.tasksService.tasksChangedForEmployee.subscribe((myNewTasks: TaskModel[]) => {
      this.myTasks = myNewTasks;
    });

    this.tasksService.fetchTasksByEmployeeName('Igor Shershen');
  }

  ngOnDestroy() {
    if (this.myTaskSubs) {
      this.myTaskSubs.unsubscribe();
    }
  }

  onSidenavToggle() {
    this.sidenavToggle.emit();
  }

}
