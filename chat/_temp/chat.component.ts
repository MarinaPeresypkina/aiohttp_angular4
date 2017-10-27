import { Component, OnInit } from '@angular/core';

import { ChatService } from './chat.service';

@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html'
})
export class ChatComponent implements OnInit {

  msgList: any[] = [];
  error: any;

  constructor(private chatService: ChatService) {
    chatService.messages.subscribe(msg => {         
      console.log("Response from websocket: " + msg);
    });
  }

  getMessages(): void {
    this.ChatService
      .getMessages()
      .then(msgList => this.msgList = msgList)
      .catch(error => this.error = error);
  }

  ngOnInit(): void {
    this.getMessages();
  }

  sendMsg(message) {
    var msg_data = {message: message};
    console.log('new message from client to websocket: ', msg_data);
    this.chatService.messages.next(msg_data);
  }
}