import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadService} from '../load.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {EmployeeModel} from '../../employee/employee.model';

@Component({
  selector: 'app-load-edit',
  templateUrl: './load-edit.component.html',
  styleUrls: ['./load-edit.component.css']
})
export class LoadEditComponent implements OnInit, OnDestroy {

  loadForm: FormGroup;
  editMode = false;
  loadId: string;
  isLoading = false;

  kinds: string[] = ['Dry', 'Frozen', 'Chilled'];
  dispatches: Observable<EmployeeModel[]>;

  componentSubs: Subscription[] = [];

  constructor(private loadService: LoadService,
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
        })
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.loadService.updateLoad(this.loadForm.value);
      this.router.navigate(['/loads']);
    } else {
      this.loadForm.patchValue({
        'task': {
          'unscheduledPickUpCount': this.loadForm.value.task.pickUpCount,
          'unscheduledDeliveryCount': this.loadForm.value.task.deliveryCount
        }
      });
      this.loadService.saveLoad(this.loadForm.value);
      this.isLoading = true;
      this.componentSubs.push(this.loadService.loadSavedConfirm
        .subscribe((loadId: string) => {
          this.router.navigate(['/tasks', loadId]);
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
