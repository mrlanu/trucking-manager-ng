import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-address-component',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {

  addressForm: FormGroup;
  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  constructor(public dialogRef: MatDialogRef<AddressComponent>,
              @Inject(MAT_DIALOG_DATA) public passedData: any) {}

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
