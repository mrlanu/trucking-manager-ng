import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskService} from '../../tasks/task.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  myTasksCount: number;
  myTaskSubs: Subscription;

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.myTaskSubs = this.taskService.numberOfTasksChangedForEmployee.subscribe(number => {
      this.myTasksCount = number;
    });

    this.taskService.fetchTasksByEmployeeName('Igor Shershen');
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
