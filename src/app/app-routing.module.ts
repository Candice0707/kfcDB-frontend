import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login-component' },
  { path: 'home-component', component: HomeComponent },
  { path: 'login-component', component: LoginComponent },
  { path: 'sign-up-component', component: SignupComponent},
  { path: 'restaurant-component', component: RestaurantComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
