import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';

interface DisplayOption {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chart-dialog.component.html',
  styleUrls: ['./chart-dialog.component.scss']
})
export class ChartDialogComponent implements OnInit {

  ratingCategory: string;
  categories: DisplayOption[] = [
    {value: "all", viewValue: 'all categories'},
    {value: "general", viewValue: 'General Rating'},
    {value: "flavor", viewValue: 'Flavor Rating'},
    {value: "service", viewValue: 'Service Rating'},
    {value: "environment", viewValue: 'Environment Rating'},
  ];

  constructor(
    public dialogRef: MatDialogRef<ChartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      restaurant_id: string,
      restaurant_name: string,
      customer_tag: string
    }){
      this.ratingCategory = 'general';
    }
  ngOnInit(): void {
  }

}
