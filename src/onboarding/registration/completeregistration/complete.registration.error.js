import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(Router)
export class CompleteRegistrationError {
	  constructor(router) {
    this.router = router;
  }
	
	  navTo() {
    this.router.navigate('login');
  }
}
