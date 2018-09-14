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
    const brokerName = '';
    const commodity = '';
    const rate = '';
    const pickUpAddress = '';
    const pickUpDate = '';
    const deliveryAddress = '';
    const deliveryDate = '';
    const weight = '';
    const pallets = '';

    this.loadForm = new FormGroup({
      'brokerName': new FormControl(brokerName, Validators.required),
      'commodity': new FormControl(commodity, Validators.required),
      'rate': new FormControl(rate, Validators.required),
      'pickUpAddress': new FormControl(pickUpAddress, Validators.required),
      'pickUpDate': new FormControl(pickUpDate, Validators.required),
      'deliveryAddress': new FormControl(deliveryAddress, Validators.required),
      'deliveryDate': new FormControl(deliveryDate, Validators.required),
      'weight': new FormControl(weight),
      'pallets': new FormControl(pallets)
    });
  }

  onSubmit() {
    this.loadService.addLoad(this.loadForm.value);
    this.router.navigate(['/listLoad']);
  }

}
