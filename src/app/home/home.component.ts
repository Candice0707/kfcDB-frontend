import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialog} from '@angular/material/dialog';
import { AuthenticationService} from '../_services';


export interface Tag {
  name: string;
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




  // alert
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';

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
    private authenticationService : AuthenticationService) { 
    if (this.authenticationService.currentUserValue) {
      this.userID = this.authenticationService.currentUserSubject.value.id;
      // this.firstName = this.authenticationService.currentUser.firstName;
      // this.lastName = this.authenticationService.currentUser.lastName;
      // this.email = this.authenticationService.currentUser.email;
    }
  }
  

  ngOnInit(): void {
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
  }

  public changeSuccessMessage() {
    this._success.next(`Profile successfully updated.`);
  }
  // openDialog() {
  //   const dialogRef = this.dialog.open(DeleteDialog);

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });    
  // }

}

// @Component({
//   selector: 'delete-dialog',
//   templateUrl: './delete-dialog.html',
// })
// export class DeleteDialog {}