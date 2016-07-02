import {inject} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {Router} from 'aurelia-router';

@inject(Router)
export class VerifyCompleteRegistration {

  constructor(router) {
    this.router = router;
  }
  
  activate(params) {
    let email = params.email;
    setTimeout(() => this.router.navigateToRoute('login', { email:email }, {replace: true}), 2000);
  }
}