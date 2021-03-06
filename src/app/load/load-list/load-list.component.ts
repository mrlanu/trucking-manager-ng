import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LoadModel} from '../load.model';
import {LoadService} from '../load.service';
import {Subscription} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../shared/ui.service';

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

  tabs = ['All', 'Addison', 'Renton', 'Portland'];
  isLoading = true;
  columnsToDisplay = ['broker', 'dispatch'];
  columnHeaderName = ['Broker', 'Dispatch'];
  dataSource = new MatTableDataSource<LoadModel>();
  expandedElement: LoadModel;
  componentSubs: Subscription[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private loadService: LoadService,
              private router: Router,
              private route: ActivatedRoute,
              private uiService: UiService) { }

  ngOnInit() {
    this.componentSubs.push(this.loadService.loadsChanged
      .subscribe((allLoads: LoadModel[]) => {
      this.dataSource.data = allLoads;
      this.isLoading = false;
    }));
    this.componentSubs.push(this.uiService.isLoadingChanged.subscribe(result => {
      this.isLoading = result;
    }));
    this.loadService.fetchAvailableLoads();
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEditLoad(loadId: string) {
    this.router.navigate(['edit', loadId], {relativeTo: this.route});
  }

  onManageLoad(loadId: string) {
    this.router.navigate(['loadManager', loadId], {relativeTo: this.route});
  }

  onTabChange(event: number) {
    // for expand all elements in the table of loads
    this.dataSource.data = [];
    this.expandedElement = null;

    const warehouse = this.tabs[event];
    if (warehouse === 'All') {
      this.loadService.getAvailableLoads();
    } else {
      this.loadService.filterLoadsByWarehouse(warehouse);
    }
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
