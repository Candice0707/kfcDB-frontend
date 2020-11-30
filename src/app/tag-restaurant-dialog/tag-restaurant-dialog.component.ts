import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';  

@Component({
  selector: 'app-tag-restaurant-dialog',
  templateUrl: './tag-restaurant-dialog.component.html',
  styleUrls: ['./tag-restaurant-dialog.component.scss']
})
export class TagRestaurantDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TagRestaurantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
    restaurant_name: string,
    newTag: string,
    restaurant_id: number,
    userID:string,
    status: 'false'
  }) { }

  onClick(message) {
    this.dialogRef.close(message);
  }
  ngOnInit(): void {
  }

}
