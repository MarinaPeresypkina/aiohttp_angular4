import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertService {
    private error_msg = ''
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    this.keepAfterNavigationChange = false;
                } else {
                    this.subject.next();
                }
            }
        });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: any, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        console.log(message)
        if (message.status){
            this.error_msg = message.json().error
        }
        else {this.error_msg = message.error}
        this.subject.next({ type: 'error', text:  this.error_msg});
    }

}