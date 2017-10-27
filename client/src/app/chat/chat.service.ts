import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Headers, Http, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http'

import { AuthenticationService } from '../auth/auth.service';
import { AlertService } from '../alert.service';
import { WebsocketService } from './websocket.service';

import { SETTINGS } from '../variables'


export interface Message {
  user?: string,
  message: string,
  date_created?: string
}

@Injectable()
export class ChatService {

  public messages: Subject<Message>  = new Subject<Message>();
  private messagesListUrl = SETTINGS.HOST_URL + '/api/messages';

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private websocketService: WebsocketService
  ){
    this.messages = <Subject<Message>>this.websocketService
      .connect()
      .map((response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        if (data.error){
          throw Observable.throw(new Error(data.error));
        }
        return {
          user : data.user,
          message: data.message,
          date_created: data.date_created
        }
      });
  }

  getMessages(){
    let headers = new Headers({ 
      'Authorization': this.authenticationService.token,
      'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.messagesListUrl, { headers: headers })
      .map(response => response.json().messages)
  }

}