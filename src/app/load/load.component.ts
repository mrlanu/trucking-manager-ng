import { Component, OnInit } from '@angular/core';
import {LoadService} from './load.service';
import {Timeouts} from 'selenium-webdriver';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {

  constructor(private loadService: LoadService) { }

  ngOnInit() {
    this.loadService.fetchAvailableLoads();
  }

}
