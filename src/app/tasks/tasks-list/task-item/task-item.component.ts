import {Component, Input, OnInit} from '@angular/core';
import {TaskModel} from '../../task.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {

  @Input() task: TaskModel;

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onEditTask(id: string) {
    this.router.navigate(['edit', id], {relativeTo: this.route});
  }

  onNewTask() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
