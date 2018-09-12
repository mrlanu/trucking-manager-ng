import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {LoadModel} from '../load.model';
import {LoadService} from '../load.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-load-list',
  templateUrl: './load-list.component.html',
  styleUrls: ['./load-list.component.css']
})
export class LoadListComponent implements OnInit, OnDestroy, AfterViewInit {

  private loadChangesSubs: Subscription;

  displayedColumns = ['brokerName', 'weight', 'pickUpDate', 'deliveryDate'];
  dataSource = new MatTableDataSource<LoadModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private loadService: LoadService) { }

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

}
