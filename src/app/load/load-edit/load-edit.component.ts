import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadService} from '../load.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-load-edit',
  templateUrl: './load-edit.component.html',
  styleUrls: ['./load-edit.component.css']
})
export class LoadEditComponent implements OnInit {

  loadForm: FormGroup;

  constructor(private loadService: LoadService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const broker = '';
    const rate = '';
    const weight = '';
    const pallets = '';
    const kind = '';
    const pickUpDate = '';
    const pickUpAddress = '';
    const deliveryDate = '';
    const deliveryAddress = '';
    const description = '';
    const commodity = '';

    this.loadForm = new FormGroup({
      'broker': new FormControl(broker, Validators.required),
      'commodity': new FormControl(commodity, Validators.required),
      'rate': new FormControl(rate, Validators.required),
      'kind': new FormControl(kind),
      'pickUpAddress': new FormControl(pickUpAddress, Validators.required),
      'pickUpDate': new FormControl(pickUpDate, Validators.required),
      'deliveryAddress': new FormControl(deliveryAddress, Validators.required),
      'deliveryDate': new FormControl(deliveryDate, Validators.required),
      'weight': new FormControl(weight),
      'pallets': new FormControl(pallets),
      'description': new FormControl(description)
    });
  }

  onSubmit() {
    this.loadService.addLoad(this.loadForm.value);
    this.router.navigate(['/listLoad']);
  }

}
