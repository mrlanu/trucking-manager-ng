import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {User} from '../user.model';
import {AuthData} from '../auth-data.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      'email': new FormControl('', {validators: [Validators.required, Validators.email]}),
      'password': new FormControl('', {validators: [Validators.required]})
    });
  }

  onSubmit() {
    this.authService.registerUser({
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    });
  }

}
