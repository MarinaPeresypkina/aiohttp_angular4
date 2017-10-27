import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { AuthenticationService } from './auth.service';
import { AlertService } from '../alert.service';


@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  model: any = {};
  returnUrl: string;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ){ }

  ngOnInit() {
    this.authenticationService.logout();
  }

  login(username: string, password: string) {
    this.authenticationService.login(this.model.username, this.model.password)
    .subscribe(
      data => this.router.navigate(['/']),
      error => this.alertService.error(error)
    );
  }

  logout(){
    this.authenticationService.logout();
  }
}
