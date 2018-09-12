import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadService} from '../load.service';

@Component({
  selector: 'app-load-edit',
  templateUrl: './load-edit.component.html',
  styleUrls: ['./load-edit.component.css']
})
export class LoadEditComponent implements OnInit {

  loadForm: FormGroup;

  constructor(private loadService: LoadService) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const brokerName = '';
    const weight = '';
    const pickUpDate = '';
    const deliveryDate = '';

    this.loadForm = new FormGroup({
      'brokerName': new FormControl(brokerName, Validators.required),
      'weight': new FormControl(weight),
      'pickUpDate': new FormControl(pickUpDate, Validators.required),
      'deliveryDate': new FormControl(deliveryDate, Validators.required)
    });
  }

  onSubmit() {
    this.loadService.createLoad(this.loadForm.value);
  }

}
