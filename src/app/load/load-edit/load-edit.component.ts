import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadService} from '../load.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {EmployeeModel} from '../../employee/employee.model';
import {LoadModel} from '../load.model';

@Component({
  selector: 'app-load-edit',
  templateUrl: './load-edit.component.html',
  styleUrls: ['./load-edit.component.css']
})
export class LoadEditComponent implements OnInit {

  loadForm: FormGroup;
  editMode = false;
  loadId: string;

  kinds: string[] = ['Dry', 'Frozen', 'Chilled'];
  dispatches: Observable<EmployeeModel[]>;

  constructor(private loadService: LoadService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.loadId = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
    this.dispatches = this.loadService.getDispatches();
  }

  private initForm() {
    let id = '';
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
    } else {
      const loadForSave: LoadModel = this.loadForm.value;
      loadForSave.task.unscheduledPickUpCount = loadForSave.task.pickUpCount;
      loadForSave.task.unscheduledDeliveryCount = loadForSave.task.deliveryCount;
      this.loadService.saveLoad(loadForSave);
      this.router.navigate(['/tasks', lo]);
    }
    this.router.navigate(['/listLoad']);
  }

  onCancel() {
    this.router.navigate(['/listLoad']);
  }

}
