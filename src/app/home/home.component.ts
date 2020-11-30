import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Subject, from} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthenticationService, UserService, RestaurantService} from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { Restaurant } from '../_models';
import { first } from 'rxjs/operators';
import { RateDialogComponent} from '../rate-dialog/rate-dialog.component';





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
  
  // restaurant list
  restaurantList: Restaurant[] = [
    // {restaurant_id: 1, name: "teamoji", address: "123 St, Champaign, IL", phone: "234-123-5467",  category: "boba", ratings: 4, image_url:"https://material.angular.io/assets/img/examples/shiba2.jpg"},
    // {restaurant_id: 2, name: "cafe bene", address: "23 St, Champaign, IL", phone: "123-355-1234",  category: "korean", ratings: 3.4, image_url:"https://material.angular.io/assets/img/examples/shiba2.jpg"},
    // {restaurant_id: 3, name: "oshis", address: "1553 St, Champaign, IL", phone: "512-235-1234",  category: "ramen", ratings: 2, image_url:"https://material.angular.io/assets/img/examples/shiba2.jpg"},
    // {restaurant_id: 4, name: "saska", address: "1123 St, Champaign, IL", phone: "123-578-4214",  category: "sushi", ratings: 5, image_url:"https://material.angular.io/assets/img/examples/shiba2.jpg"}
  ];
  currentRate = 4.0;


  //profile
  firstName : string;
  lastName : string;
  email : string;
  userID : number;

  //search
  searchkey : string;
  
  // alert
  private _success = new Subject<string>();
  private _fail = new Subject<string>();
  private _searchFail = new Subject<string>();
  private _rateSuccess = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';
  failMessage = '';
  searchfailMessage = '';
  rateSuccessMessage = '';


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
    private router: Router,
    private restaurantService : RestaurantService) { 
    this.update_localStorage();
    console.log("constructor: ", this.userID);
    this.get_profile();
    this.get_restaurant_list();
    
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

    this._searchFail.subscribe(message => this.searchfailMessage = message);
    this._searchFail.pipe(
      debounceTime(5000)
    ).subscribe(() => this.searchfailMessage = '');
    this._rateSuccess.subscribe(message => this.rateSuccessMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.rateSuccessMessage = '');
  }


  public changeSuccessMessage() {
    this._success.next(`Profile successfully updated.`);
  }
  public changeFailMessage() {
    this._fail.next(`Please fill in required fields and try again.`);
  }

  get_restaurant_list() {
    this.restaurantService.searchRestaurantByCategory(this.searchkey).pipe().subscribe(
      data => {
        this.restaurantList = data;
      },
      error => {
        this._searchFail.next(`Failed to fetch data. Please try again.`);
      }
    )
  }
  get_profile() {
    this.userService.get_profile(this.userID).pipe(first()).subscribe(
      data => {
        this.update_localStorage();
      },
      error => {
        // this.router.navigate(['/login-component']);
      }
    );
    this.get_tags();
  }

  get_tags() {
    this.userService.get_tags(this.userID).pipe(first()).subscribe(
      data => {
        this.tags = data;
      },
      error => {
        this._fail.next(`Failed to fetch tags, please try again.`);
      }
    );
  }
  update_profile() {
    this.update_tags();
    if(this.lastName.length == 0 || this.firstName.length == 0) {
      // this.changeFailMessage();
      return;
    }
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

  update_tags() {
    this.userService.update_tags(this.userID, this.tags).pipe(first())
      .subscribe(
        data => {
          this.changeSuccessMessage();
          this.get_tags();
        },
        error => {
          this._fail.next(`Update Tags Failed. Please fill in required fields and try again.`);
        }
      )
    
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

  navigateTo(restaurant_id, restaurant_name) {
    this.router.navigate(['/restaurant-component', {restaurant_id:restaurant_id, restaurant_name:restaurant_name}]);
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
  flavorRating: number;
  environmentRating: number;
  serviceRating : number;

  openRateDialog(restaurant_id, restaurantName) {
    const rateDialogRef = this.dialog.open(RateDialogComponent, {
      data: { restaurant_name: restaurantName,
        flavorRating: this.flavorRating,
        environmentRating: this.environmentRating,
        serviceRating: this.serviceRating,
        userID: this.userID,
        status: 'false'
    }});

    rateDialogRef.afterClosed().subscribe(result => {
      if(result.status =='true' ) {
        
        this.flavorRating = result.flavorRating;
        this.environmentRating = result.environmentRating;
        this.serviceRating = result.serviceRating;
        this.rateRestaurant(restaurant_id);
      }
      this.flavorRating = 0;
      this.environmentRating = 0;
      this.serviceRating = 0;
    });
  }

  rateRestaurant(restaurant_id) {
    console.log("flav: " + this.flavorRating);
    this.restaurantService.rateRestaurant(this.userID, restaurant_id, this.flavorRating, 
      this.environmentRating, this.serviceRating)
        .pipe().subscribe(
          data => {
            this._rateSuccess.next(`Thank you for you feedbacks!`);
          },
          error => {
            this._fail.next(`Update Failed. Please fill in required fields and try again.`);
          }
        );
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