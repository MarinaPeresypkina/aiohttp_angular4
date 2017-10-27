import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { CookieService } from 'ngx-cookie-service';

import 'rxjs/add/operator/map'

import { SETTINGS } from '../variables'

@Injectable()
export class AuthenticationService {
  public currentUser: null;
  public token: string;
  private loginUrl = SETTINGS.HOST_URL +'/api/login';

  constructor(
    private http: Http,
    private cookieService: CookieService
    ) {
    if (this.cookieService.get('currentUser')){
      var currentUser = JSON.parse(this.cookieService.get('currentUser'));
      this.currentUser = currentUser
      this.token = currentUser && currentUser.token;
    }
  }

  login(username: string, password: string){
    return this.http.post(this.loginUrl, 
      JSON.stringify({ username: username, password: password }))
      .map(response => {
        let token = response.json() && response.json().token;
        this.currentUser = response.json();
        this.token = token;
        if (token) {
          this.cookieService.set('currentUser', 
            JSON.stringify({ username: username, token: token }));
        }
      })
  }

  logout() {
    this.currentUser = null
    this.token = null;
    this.cookieService.delete('currentUser');
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}