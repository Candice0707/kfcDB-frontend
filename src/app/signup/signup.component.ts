import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email = "candiceeee@yahoo.com";
  password = "okkay";
  submitted = false;
  signupGroup: FormGroup;
  loading = false;
  
  // alert
  private _fail = new Subject<string>();
  staticAlertClosed = false;
  failMessage = '';
  
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.signupGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
  });
    this._fail.subscribe(message => this.failMessage = message);
      this._fail.pipe(
        debounceTime(5000)
      ).subscribe(() => this.failMessage = '');
  }

  get f() { return this.signupGroup.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupGroup.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.signup(this.f.email.value, this.f.password.value, this.f.firstname.value, this.f.lastname.value)
        .pipe(first())
        .subscribe(
            data => {
              this.router.navigate(['/login-component']);
            },
            error => {
                this.loading = false;
                this._fail.next(`Sign up Failed.`);
            });
    }
}
