import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LoadLogService} from './load-log.service';
import {ActivatedRoute, Route} from '@angular/router';
import {Subscription} from 'rxjs';
import {LogModel} from './log.model';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-load-log',
  templateUrl: './load-log.component.html',
  styleUrls: ['./load-log.component.css']
})
export class LoadLogComponent implements OnInit, OnDestroy {

  @Input() loadId: string;
  displayedColumns = ['date', 'description', 'employee'];
  dataSource = new MatTableDataSource<LogModel>();
  componentSubs: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private loadLogService: LoadLogService) { }

  ngOnInit() {
    this.componentSubs.push(this.loadLogService.logChange
      .subscribe((log: LogModel[]) => {
        this.dataSource.data = log;
      }));
    this.loadLogService.fetchLogByLoadId(this.loadId);
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }



}
