import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskService} from '../../tasks/task.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuth = false;
  myTasksCount: number;
  myTaskSubs: Subscription;
  authChangeSubs: Subscription;

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private taskService: TaskService,
              private authService: AuthService) { }

  ngOnInit() {
    this.authChangeSubs = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
    this.myTaskSubs = this.taskService.numberOfTasksChangedForEmployee.subscribe(number => {
      this.myTasksCount = number;
    });

    this.taskService.fetchTasksByEmployeeName('Igor Shershen');
  }

  ngOnDestroy() {
    if (this.myTaskSubs) {
      this.myTaskSubs.unsubscribe();
    }
    if (this.authChangeSubs) {
      this.authChangeSubs.unsubscribe();
    }
  }

  onSidenavToggle() {
    this.sidenavToggle.emit();
  }

}
