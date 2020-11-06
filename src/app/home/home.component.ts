import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthenticationService} from '../_services';
import { UserService } from '../_services'
import { Router, ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators';



export interface Tag {
  name: string;
}

export interface Restaurant {
  restaurant_id: number;
  name: string;
  address: string;
  phone: string;
  category: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [
    {name: 'Lemon'},
    {name: 'Lime'},
    {name: 'Apple'},
  ];
  
  
  currentRate = 4.0;


  //profile
  firstName : string;
  lastName : string;
  email : string;
  userID : number;

  //search
  searchkey:string;
  
  // alert
  private _success = new Subject<string>();
  private _fail = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';
  failMessage = '';

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tags
    if ((value || '').trim()) {
      this.tags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Tag): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
 
  

  constructor(public dialog: MatDialog,
    private authenticationService : AuthenticationService,
    private userService : UserService,
    private route: ActivatedRoute,
    private router: Router) { 
    this.update_localStorage();
    console.log("constructor: ", this.userID);
    this.get_profile();
  }
  

  ngOnInit(): void {
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
    
    this._fail.subscribe(message => this.failMessage = message);
    this._fail.pipe(
      debounceTime(5000)
    ).subscribe(() => this.failMessage = '');
  }


  public changeSuccessMessage() {
    this._success.next(`Profile successfully updated.`);
  }
  public changeFailMessage() {
    this._fail.next(`Please fill in required fields and try again.`);
  }

  get_profile() {
    this.userService.get_profile(this.userID).pipe(first()).subscribe(
      data => {
        this.update_localStorage();
      },
      error => {
        this.router.navigate(['/login-component']);
      }
    );
  }

  update_profile() {
    if(this.lastName.length == 0 || this.firstName.length == 0) {
      this.changeFailMessage();
      return;
    }
    console.log("userid: ", this.userID);
    this.userService.update_profile(this.userID, this.firstName, this.lastName)
        .pipe(first())
        .subscribe(
            data => {
              this.changeSuccessMessage();
              this.get_profile();
            },
            error => {
              this._fail.next(`Update Failed. Please fill in required fields and try again.`);
            }
            );
  }

  update_localStorage() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = user.customer_id;
    this.firstName = user.firstname;
    this.lastName = user.lastname;
    this.email = user.email;
  }
  delete_account() {
    this.authenticationService.delete_account(this.userID)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login-component']);
        },
        error => {
          this._fail.next(`Delete attemp failed.`);
        }
      );
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeleteDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result == "true") {
        this.delete_account();
      }
    });  
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.html',
  styleUrls: ['./home.component.scss']
})
export class DeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>){

    }
  onClick(message) {
    this.dialogRef.close(message);
  }
}