import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LoadEditComponent} from './load/load-edit/load-edit.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signUp', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'editLoad', component: LoadEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
