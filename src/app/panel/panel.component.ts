import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../servicio/login/login.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor(private router: Router, public loginService:LoginService) { }

  ngOnInit(): void {

  }

  logout() : void {
    this.loginService.logout();
  }
}
