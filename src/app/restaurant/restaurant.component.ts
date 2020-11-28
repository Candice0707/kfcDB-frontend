import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RateDialogComponent} from '../rate-dialog/rate-dialog.component';

export interface Tag {
  name: string;
  freq: number;
}

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  restaurant_id : string;
  restaurant_name : string;
  phone = "217-123-1234";
  address = "123 St, Champaign, IL";
  rating = 4;
  category = "boba";
  userID: number;

  restaurant_tags: Tag[] = [
    {name: 'Super cozy', freq: 30},
    {name: 'Coffee', freq: 18},
    {name: 'Matcha Loversss', freq: 9},
    {name: 'Music Live!', freq: 3}
  ];

  //ratings
  flavorRating: number;
  environmentRating: number;
  serviceRating: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) {
    this.getRestaurantData(); 
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = user.customer_id;  

  }

  ngOnInit(): void {
  }

  getRestaurantData() {
    this.restaurant_id = this.route.snapshot.paramMap.get("restaurant_id");
    this.restaurant_name = this.route.snapshot.paramMap.get("restaurant_name");
    // todo: get restaurant data api
  }

  openRateDialog(restaurant_id, restaurantName) {
    const rateDialogRef = this.dialog.open(RateDialogComponent, {
      data: { restaurant_name: restaurantName,
        flavorRating: this.flavorRating,
        environmentRating: this.environmentRating,
        serviceRating: this.serviceRating,
        userID: this.userID
    }});

    rateDialogRef.afterClosed().subscribe(result => {
      // console.log(`Rate Dialog result: ${result}`);
      console.log(restaurant_id + ':'+ restaurantName);
      console.log("service : "+ result.serviceRating);
      if(result == "true") {
        //this.rateRestaurant(restaurant_id, flavor, enviorment, service);
      }
    });
  }
}
