import { Component, OnInit } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';

// export interface DialogData {
//   username: string;
//   password: string;
// }


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {  
  username: string;
  password: string;
  constructor() { 
    
  }

  ngOnInit(): void {
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(SignUpDialog, {
  //     width: '250px',
  //     data: {username: this.username, password: this.password}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     // this.animal = result;
  //     this.username = result.username;
  //     this.password = result.password;
  //   });
  // }

}

// @Component({
//   selector: 'sign-up-dialog',
//   templateUrl: '/src/app/login/sign-up-dialog.html',
// })
// export class SignUpDialog {

//   constructor(
//     public dialogRef: MatDialogRef<SignUpDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }
