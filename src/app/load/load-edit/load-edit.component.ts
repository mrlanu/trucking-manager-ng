import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadService} from '../load.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs';

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
  dispatches: Observable<any>;

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
    let deliveryCount: number;
    let pickUpDate: Date;
    let pickUpAddress = '';
    let deliveryDate: Date;
    let deliveryAddress = '';
    let description = '';
    let commodity = '';
    let unscheduledTasks: boolean;

    if (this.editMode) {
      const load = this.loadService.getLoadById(this.loadId);
      id = load.id;
      broker = load.broker;
      dispatch = load.dispatch;
      rate = load.rate;
      weight = load.weight;
      pallets = load.pallets;
      kind = load.kind;
      pickUpCount = load.pickUpCount;
      deliveryCount = load.deliveryCount;
      pickUpDate = load.pickUpDate.toDate();
      pickUpAddress = load.pickUpAddress;
      deliveryDate = load.deliveryDate.toDate();
      deliveryAddress = load.deliveryAddress;
      description = load.description;
      commodity = load.commodity;
      unscheduledTasks = load.unscheduledTasks;
    }

    this.loadForm = new FormGroup({
      'id': new FormControl(id),
      'broker': new FormControl(broker, Validators.required),
      'dispatch': new FormControl(dispatch, Validators.required),
      'commodity': new FormControl(commodity, Validators.required),
      'rate': new FormControl(rate, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'pickUpCount': new FormControl(pickUpCount, Validators.required),
      'deliveryCount': new FormControl(deliveryCount, Validators.required),
      'kind': new FormControl(kind),
      'pickUpAddress': new FormControl(pickUpAddress, Validators.required),
      'pickUpDate': new FormControl(pickUpDate, Validators.required),
      'deliveryAddress': new FormControl(deliveryAddress, Validators.required),
      'deliveryDate': new FormControl(deliveryDate, Validators.required),
      'weight': new FormControl(weight, Validators.pattern(/^[1-9]+[0-9]*$/)),
      'pallets': new FormControl(pallets, Validators.pattern(/^[1-9]+[0-9]*$/)),
      'description': new FormControl(description),
      'unscheduledTasks': new FormControl(unscheduledTasks)
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.loadService.updateLoad(this.loadForm.value);
    } else {
      this.loadService.addLoad(this.loadForm.value);
    }
    this.router.navigate(['/listLoad']);
  }

  onCancel() {
    this.router.navigate(['/listLoad']);
  }

}
