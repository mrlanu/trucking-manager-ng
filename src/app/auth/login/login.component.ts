import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;
  private loadingSubs: Subscription;

  constructor() { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      email: new FormControl('',
        {validators: [Validators.required, Validators.email]
        }),
      password: new FormControl('',
        {validators: [Validators.required]
        })
    });
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  onSubmit() {}

}
