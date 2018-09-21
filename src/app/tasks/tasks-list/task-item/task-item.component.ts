import {Component, Input, OnInit} from '@angular/core';
import {TaskModel} from '../../task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {

  @Input() task: TaskModel;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService) { }

  ngOnInit() {
  }

  onEditTask(id: string) {
    this.router.navigate(['edit', id], {relativeTo: this.route});
  }

  onDeleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

}
