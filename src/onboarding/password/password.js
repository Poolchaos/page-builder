import {inject, LogManager} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';

@inject(Router)
export class Password {
  
  constructor(router) {
    
    this.router = router;
  }
  
  configureRouter(config, router) {

    config.map([


      {route: '',                name: 'forgotpassword',  moduleId: 'onboarding/password/forgotpassword/forgotpassword',             nav: false, title: 'Forgot Password'},
//      {route: 'resetpassword',   name: 'resetpassword',   moduleId: 'onboarding/password/resetpassword/resetpassword/:passportId',   nav: false, title: 'Reset Password'},
      {route: 'emailsubmitted',  name: 'emailsubmitted',  moduleId: 'onboarding/password/emailsubmitted/emailsubmitted',             nav: false, title: 'Email Submitted'}
    ]);

    this.router = router;
  }
  
}