import { Component, OnInit } from '@angular/core';

import { ChatService } from './chat.service';
import { AlertService } from '../alert.service';
import { AuthenticationService } from '../auth/auth.service';


@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html'
})
export class ChatComponent implements OnInit {
  msgList: any[] = [];

  constructor(
    private chatService: ChatService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {}

  getMessages(): void {
    this.chatService.getMessages()
    .subscribe(
      data => {this.msgList = data},
      error => this.alertService.error(error)
    );
  }

  ngOnInit(): void {
    this.getMessages();
    this.chatService.messages.subscribe(
      data => {this.msgList.push(data)},
      error => {this.alertService.error(error)});
  }

  sendMsg(message) {
    this.chatService.messages.next({message: message});
  }
}