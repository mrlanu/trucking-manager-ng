import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadService} from '../load.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {EmployeeModel} from '../../employee/employee.model';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-load-edit',
  templateUrl: './load-edit.component.html',
  styleUrls: ['./load-edit.component.css']
})
export class LoadEditComponent implements OnInit, OnDestroy {

  loggedInEmployee: EmployeeModel;
  loadForm: FormGroup;
  editMode = false;
  loadId: string;
  isLoading = false;

  kinds: string[] = ['Dry', 'Frozen', 'Chilled'];
  dispatches: Observable<EmployeeModel[]>;

  componentSubs: Subscription[] = [];

  constructor(private loadService: LoadService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.componentSubs.push(this.route.params.subscribe(
      (params: Params) => {
        this.loadId = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    ));
    this.loggedInEmployee = this.authService.getLoggedInEmployee();
    this.dispatches = this.loadService.getDispatches();
  }


  private initForm() {
    let id = '';
    let date = new Date();
    let broker = '';
    let dispatch = '';
    let rate: number;
    let weight: number;
    let pallets: number;
    let kind = '';
    let pickUpCount: number;
    let unscheduledPickUpCount: number;
    let deliveryCount: number;
    let unscheduledDeliveryCount: number;
    let description = '';
    let commodity = '';
    let warehouse = '';

    if (this.editMode) {
      const load = this.loadService.getLoadById(this.loadId);
      id = load.id;
      date = load.date.toDate();
      broker = load.broker;
      dispatch = load.dispatch;
      rate = load.rate;
      weight = load.weight;
      pallets = load.pallets;
      kind = load.kind;
      pickUpCount = load.task.pickUpCount;
      unscheduledPickUpCount = load.task.unscheduledPickUpCount;
      deliveryCount = load.task.deliveryCount;
      unscheduledDeliveryCount = load.task.unscheduledDeliveryCount;
      description = load.description;
      commodity = load.commodity;
      warehouse = load.warehouse;
    }

    this.loadForm = new FormGroup({
      'id': new FormControl(id),
      'date': new FormControl(date),
      'broker': new FormControl(broker, Validators.required),
      'dispatch': new FormControl(dispatch, Validators.required),
      'commodity': new FormControl(commodity, Validators.required),
      'rate': new FormControl(rate, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'kind': new FormControl(kind),
      'weight': new FormControl(weight, Validators.pattern(/^[1-9]+[0-9]*$/)),
      'pallets': new FormControl(pallets, Validators.pattern(/^[1-9]+[0-9]*$/)),
      'description': new FormControl(description),
      'task': new FormGroup({
          'pickUpCount': new FormControl(pickUpCount, Validators.required),
          'unscheduledPickUpCount': new FormControl(unscheduledPickUpCount),
          'deliveryCount': new FormControl(deliveryCount, Validators.required),
          'unscheduledDeliveryCount': new FormControl(unscheduledDeliveryCount),
      }),
      'warehouse': new FormControl(warehouse)
    });
  }

  onSubmit() {
    const load = this.loadForm.value;
    if (this.editMode) {
      this.loadService.updateLoad(load);
      this.loadService.addLog(load.id, 'Load has been edited', this.loggedInEmployee);
      this.router.navigate(['/loads']);
    } else {
      this.loadForm.patchValue({
        'task': {
          'unscheduledPickUpCount': load.task.pickUpCount,
          'unscheduledDeliveryCount': load.task.deliveryCount
        }
      });
      this.loadService.saveLoad(load);
      this.isLoading = true;
      this.componentSubs.push(this.loadService.loadSavedConfirm
        .subscribe((loadId: string) => {
          this.loadService.addLog(loadId, 'Load has been gotten', this.loggedInEmployee);
          this.router.navigate(['loads', 'loadManager', loadId]);
        }));
    }
  }

  onCancel() {
    this.router.navigate(['loads']);
  }

  ngOnDestroy() {
    this.componentSubs.forEach(subs => {
      subs.unsubscribe();
    });
  }
}
