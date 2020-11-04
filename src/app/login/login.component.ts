import { Component, OnInit } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {  
  username = "candicehouhouhou";
  password = "okokok";
  constructor() { 
    
  }

  ngOnInit(): void {
  }
}
