import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LoadService} from '../../load/load.service';
import {LoadModel} from '../../load/load.model';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {

  load: LoadModel;
  routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private loadService: LoadService,
              private router: Router) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.load = this.loadService.getLoadById(params['id']);
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onCancel() {
    this.router.navigate(['/listLoad']);
  }

}
