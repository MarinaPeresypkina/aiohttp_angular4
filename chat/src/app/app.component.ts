import { Component } from '@angular/core';

import { AuthenticationService } from './auth/auth.service';


@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html'
})

export class AppComponent { 
	public currentUser = null

	constructor(private authenticationService: AuthenticationService) { }

}
