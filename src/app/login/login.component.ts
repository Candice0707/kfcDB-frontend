import { Component, OnInit } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import { AuthenticationService } from '../_services';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {  
  email = "candicehouhouhou";
  password = "okokok";
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

   // alert
   private _fail = new Subject<string>();
   staticAlertClosed = false;
   failMessage = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        // login failed alert
        this._fail.subscribe(message => this.failMessage = message);
        this._fail.pipe(
            debounceTime(5000)
        ).subscribe(() => this.failMessage = '');
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.authenticationService.login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          data => {
              this.router.navigate(['/home-component']);
          },
          error => {
              this.loading = false;
              this._fail.next(`Login Failed.`);
          });
    }
}
