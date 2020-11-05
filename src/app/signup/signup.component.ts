import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

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
  signupForm: FormGroup;
  loading = false;
  
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;


    // stop here if form is invalid
    if (this.signupForm.invalid) {
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
            });
    }
}
