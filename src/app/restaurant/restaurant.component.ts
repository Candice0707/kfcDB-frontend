import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 


@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  restaurant_id : string;
  restaurant_name : string;
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
