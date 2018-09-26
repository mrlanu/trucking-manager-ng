import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      email: new FormControl('mrlanu@gmail.com',
        {validators: [Validators.required, Validators.email]
        }),
      password: new FormControl('123456',
        {validators: [Validators.required]
        })
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  ngOnDestroy() {}

}
