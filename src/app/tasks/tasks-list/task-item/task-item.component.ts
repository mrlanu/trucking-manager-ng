import {Component, Input, OnInit} from '@angular/core';
import {TaskModel} from '../../task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {

  @Input() task: TaskModel;

  constructor() { }

  ngOnInit() {
  }

}
