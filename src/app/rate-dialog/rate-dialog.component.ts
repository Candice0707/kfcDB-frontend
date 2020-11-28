import { Component, OnInit } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';  


@Component({
  selector: 'app-rate-dialog',
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.scss']
})
export class RateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      restaurant_name: string,
      flavorRating: number,
      environmentRating: number,
      serviceRating: number
      userID:string
    }){
      
    }
  
  onClick(message) {
    this.dialogRef.close(message);
  }

  ngOnInit(): void {
  }

}