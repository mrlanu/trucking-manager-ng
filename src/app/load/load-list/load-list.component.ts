import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LoadModel} from '../load.model';
import {LoadService} from '../load.service';
import {Subscription} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-load-list',
  templateUrl: './load-list.component.html',
  styleUrls: ['./load-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class LoadListComponent implements OnInit, OnDestroy, AfterViewInit {

  private loadChangesSubs: Subscription;

  columnsToDisplay = ['broker', 'pickUpAddress', 'deliveryAddress', 'dispatch'];
  columnHeaderName = ['Broker', 'Pick Up', 'Delivery', 'Dispatch'];
  dataSource = new MatTableDataSource<LoadModel>();
  expandedElement: LoadModel;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private loadService: LoadService,
              private router: Router) { }

  ngOnInit() {
    this.loadChangesSubs = this.loadService.loadsChanged.subscribe((allLoads: LoadModel[]) => {
      this.dataSource.data = allLoads;
    });
    this.loadService.fetchAvailableLoads();
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.loadChangesSubs) {
      this.loadChangesSubs.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEditLoad(idLoad: string) {
    this.router.navigate(['/editLoad', idLoad]);
  }

  onEditTask(loadId: string) {
    this.router.navigate(['/tasks', loadId]);
  }

}
