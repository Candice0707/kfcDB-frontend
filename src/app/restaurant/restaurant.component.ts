import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RateDialogComponent} from '../rate-dialog/rate-dialog.component';
import { TagRestaurantDialogComponent } from '../tag-restaurant-dialog/tag-restaurant-dialog.component'
import { RestaurantService} from '../_services';
import {Subject, from} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { CloudData, CloudOptions,ZoomOnHoverOptions } from 'angular-tag-cloud-module';
import { ChartDialogComponent } from '../chart-dialog/chart-dialog.component'



export interface Tag {
  name: string;
  freq: number;
}

export interface DisplayOption {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  
  restaurant_info = {
    restaurant_id : '',
    restaurant_name : "",
    phone : "",
    address :"123 St, Champaign, IL",
    general_ratings : 4,
    category : "boba",
    flavorRating: 1,
    environmentRating: 1,
    serviceRating: 1
  }
  restaurant_id : string;
  restaurant_name: string;
  userID: number;

  restaurant_tags: Tag[] = [
    {name: 'Super cozy', freq: 30},
    {name: 'Coffee', freq: 18},
    {name: 'Matcha Loversss', freq: 9},
    {name: 'Music Live!', freq: 3}
  ];

  //admin account
  adminAccount = false;

  //add ratings
  flavorRating: number;
  environmentRating: number;
  serviceRating: number;

  //new tag
  newTag: string;

  // alert
  private _searchFail = new Subject<string>();
  private _success = new Subject<string>();
  private _fail = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';
  failMessage = '';
  searchfailMessage = '';

  // word cloud
  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3, // Elements will become 130 % of current zize on hover
    transitionTime: 0.5, // it will take 1.2 seconds until the zoom level defined in scale property has been reached
    delay: 0.1 // Zoom will take affect after 0.8 seconds
  };
  cloudData: CloudData[] = [
    {text: 'Woood1', weight: 19},
    {text: 'Apple', weight: 33},
    {text: 'Lemon', weight: 10},
    {text: 'fff', weight: 20},
    {text: 'sea', weight: 25}
    // ...
  ];
  displayLimit = 20;
  displayOptions: DisplayOption[] = [
    {value: 10, viewValue: '10 tags'},
    {value: 20, viewValue: '20 tags'},
    {value: 50, viewValue: '50 tags'},
  ];

  constructor(private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private restaurantService : RestaurantService) {
    this.getRestaurantData(); 
    this.get_retaurant_tags(this.restaurant_id, 10);
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = user.customer_id;  
    if(this.userID == 1) {
      this.adminAccount = true;
    }
    this.getVisitedCustomerTags(this.displayLimit);
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
  }

  public rateSuccessMessage() {
    this._success.next(`Thank you for you feedbacks!`);
  }
  public rateFailMessage() {
    this._fail.next(`Please fill in required fields and try again.`);
  }

  public tagSuccessMessage() {
    this._success.next(`New tag submitted. Thank you for you feedbacks!`);
  }
  public tagFailMessage() {
    this._fail.next(`Please fill in required fields and try again.`);
  }

  //word cloud
  openData(clicked: CloudData){
    if(clicked.srcElement.nodeName == 'SPAN') {
      console.log(clicked);
      // word
      console.log(clicked.srcElement.innerText);
      this.openChartDialog(clicked.srcElement.innerText);
    }
  }

  openChartDialog(customer_tag) {
    const rateDialogRef = this.dialog.open(ChartDialogComponent, {
      data: { 
        restaurant_id: this.restaurant_id,
        restaurant_name: this.restaurant_name,
        customer_tag: customer_tag
    }});
  }



  getRestaurantData() {
    this.restaurant_id = this.route.snapshot.paramMap.get("restaurant_id");
    this.restaurant_name = this.route.snapshot.paramMap.get("restaurant_name");
    //  get restaurant data api
    this.get_restaurant_profile(this.restaurant_id);
  }

  get_restaurant_profile(restaurant_id) {
    this.restaurantService.getRestaurantProfile(restaurant_id).pipe().subscribe(
      data => {
        this.restaurant_info = data;
      },
      error => {
        this._searchFail.next(`Failed to fetch data. Please try again.`);
      }
    )
  }

  get_retaurant_tags(restaurant_id, length) {
    this.restaurantService.getRestaurantTags(Number(restaurant_id), length).pipe().subscribe(
      data => {
        this.restaurant_tags = data;
      },
      error => {
        this._searchFail.next(`Failed to fetch restaurant tags. Please try again.`);
      }
    )
  }

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
      // console.log(`Rate Dialog result: ${result}`);
      console.log(restaurant_id + ':'+ restaurantName);
      console.log("rate status : "+ result.status);
      if(result.status =='true') {
        if(!result.flavorRating || !result.environmentRating || !result.serviceRating) {
          this._fail.next(`Update Failed. Please fill in required fields and try again.`);
          return;
        }
        this.flavorRating = result.flavorRating;
        this.environmentRating = result.environmentRating;
        this.serviceRating = result.serviceRating;
        this.rateRestaurant();
      }
      this.flavorRating = 0;
      this.environmentRating = 0;
      this.serviceRating = 0;
    });
  }

  rateRestaurant() {
    console.log("flav: " + this.flavorRating);
    this.restaurantService.rateRestaurant(this.userID,this.restaurant_id, this.flavorRating, 
      this.environmentRating, this.serviceRating)
        .pipe().subscribe(
          data => {
            this.rateSuccessMessage();
            this.get_restaurant_profile(this.restaurant_id);
          },
          error => {
            this._fail.next(`Update Failed. Please fill in required fields and try again.`);
          }
        );
  }


  openTagDialog(restaurant_id) {
    const tagDialogRef = this.dialog.open(TagRestaurantDialogComponent, {
      data: { restaurant_name: this.restaurant_name,
        newTag: this.newTag,
        restaurant_id: restaurant_id,
        userID: this.userID
    }});

    tagDialogRef.afterClosed().subscribe(result => {
      console.log("tag status : "+ result.status);
      if(result.status =='true') {
        this.tagRestaurant(result.newTag);
      }
    });
  }

  tagRestaurant(tag) {
    if(!tag || tag.length == 0) {
      this.tagFailMessage();
      return;
    }
    this.restaurantService.tagRestaurant(this.userID, tag, Number(this.restaurant_id))
        .pipe().subscribe(
          data => {
            this.tagSuccessMessage();
            this.get_retaurant_tags(this.restaurant_id, 10);
          },
          error => {
            this._fail.next(`Update Failed. Please fill in required fields and try again.`);
          }
        );
  }

  // for admin account only
  deleteRestaurant() {
    this.restaurantService.deleteRestaurant(this.restaurant_id).pipe().subscribe(
      data => {
        this.router.navigate(['/home-component']);
      },
      error => {
        this._fail.next(`Failed to delete restaurant. Please try again.`);
      }
    );
  }

  //word cloud
  getVisitedCustomerTags(length) {
    this.restaurantService.get_visited_customers_tags(Number(this.restaurant_id), length).pipe()
      .subscribe(
        data => {
          this.cloudData = data;
          
        },
        error => {
          this._fail.next(`Failed to fetch cloud data. Please try again.`);
        }
      )
  }
}

