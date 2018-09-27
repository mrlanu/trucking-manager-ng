import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-address-component',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddressComponent>,
              @Inject(MAT_DIALOG_DATA) public passedData: any) {}

  addressForm: FormGroup;

  ngOnInit() {
    this.addressForm = new FormGroup({
      'address1': new FormControl('', Validators.required),
      'address2': new FormControl(''),
      'city': new FormControl('', Validators.required),
      'state': new  FormControl('', Validators.required),
      'zip': new FormControl('', Validators.required)
    });
    if (this.passedData.address) {
      this.addressForm.setValue(this.passedData.address);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
