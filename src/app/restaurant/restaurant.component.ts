import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
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

  restaurant_tags: Tag[] = [
    {name: 'Super cozy', freq: 30},
    {name: 'Coffee', freq: 18},
    {name: 'Matcha Loversss', freq: 9},
    {name: 'Music Live!', freq: 3}
  ];

  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.getRestaurantData();   
  }

  ngOnInit(): void {
  }

  getRestaurantData() {
    this.restaurant_id = this.route.snapshot.paramMap.get("restaurant_id");
    this.restaurant_name = this.route.snapshot.paramMap.get("restaurant_name");
    // todo: get restaurant data api
  }
}
