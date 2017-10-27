import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';
import { Headers, Http } from '@angular/http';


const HOST_URL = "0.0.0.0:8080"

export interface Message {
  message: string
}

@Injectable()
export class ChatService {

  public messages: Subject<Message>;
  private messagesUrl = 'http://' + HOST_URL;
  private chatUrl = 'ws://' + HOST_URL + '/ws?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwiaWQiOjJ9.EwKM0WKZ9J2J6JXHIAFynF7IcQ8qZ43cb5ApZw-j6TI';

  constructor(private http: Http, wsService: WebsocketService) {
    this.getMessages();
    this.messages = <Subject<Message>>wsService
      .connect(this.chatUrl)
      .map((response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return {
          message: data.message
        }
      });
  }

  getMessages(){
    return this.http.get(this.messagesUrl)
      .toPromise()
      .then(response => response.json().messages)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}