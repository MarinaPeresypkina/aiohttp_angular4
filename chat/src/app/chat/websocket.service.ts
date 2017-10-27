import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Observer } from "rxjs/Observer";

import { AuthenticationService } from '../auth/auth.service';

import { SETTINGS } from '../variables'


@Injectable()
export class WebsocketService {

  private chatUrl = SETTINGS.WS_URL;
  private subject: Subject<MessageEvent>;

  constructor(private authenticationService: AuthenticationService){ }

  // For chat box
  public connect(): Subject<MessageEvent> {
      if (!this.subject) {
          this.subject = this.create();
          console.log("Successfully connected: " + this.chatUrl);
      }
      return this.subject;
  }

  private create(): Subject<MessageEvent> {

      let ws = new WebSocket(this.chatUrl + this.authenticationService.token);

      let observable = Observable.create(
          (obs: Observer<MessageEvent>) => {
              ws.onmessage = obs.next.bind(obs);
              ws.onerror   = obs.error.bind(obs);
              ws.onclose   = obs.complete.bind(obs);

              return ws.close.bind(ws);
          });

      let observer = {
          next: (data: Object) => {
              if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify(data));
              }
          }
      };
      return Subject.create(observer, observable);
  }

}
