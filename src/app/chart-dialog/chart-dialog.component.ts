import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { RestaurantService } from '../_services';

interface DisplayOption {
  value: string;
  viewValue: string;
}

interface Data {
  ratingbin:number;
  frequency: number;
}

@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chart-dialog.component.html',
  styleUrls: ['./chart-dialog.component.scss']
})
export class ChartDialogComponent implements OnInit {

  ratingCategory: string;
  restaurant_id: string;
  customer_tag: string;
  categories: DisplayOption[] = [
    // {value: "all", viewValue: 'all categories'},
    {value: "general", viewValue: 'General Rating'},
    {value: "flavor", viewValue: 'Flavor Rating'},
    {value: "service", viewValue: 'Service Rating'},
    {value: "environment", viewValue: 'Environment Rating'},
  ];

  chartData: Data[] = [
    {ratingbin: 1,
    frequency: 3},
    {ratingbin: 2,
    frequency: 4},
    {ratingbin: 3,
    frequency: 30},
    {ratingbin: 4,
    frequency: 20},
    {ratingbin: 5,
    frequency: 17},
  ];


  constructor(
    public dialogRef: MatDialogRef<ChartDialogComponent>,
    private restaurantService: RestaurantService,
    @Inject(MAT_DIALOG_DATA) public data: {
      restaurant_id: string,
      restaurant_name: string,
      customer_tag: string
    }){
      this.ratingCategory = 'general';
      this.restaurant_id = data.restaurant_id;
      this.customer_tag = data.customer_tag;
      this.getData();
    }
  ngOnInit(): void {
  }

  getData() {
    this.restaurantService.get_group_avg_rating(Number(this.restaurant_id), this.customer_tag, this.ratingCategory)
      .pipe().subscribe(
        data => {
          this.chartData = data;
        },
        error => {
          // this._fail.next('Failed to fetch data. Please try again');
        }
      );
  }

}
