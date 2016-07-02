/*
*/
import {UserSession} from 'zailab.common';
/*
*/
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
@inject(UserSession, Router)
export class Logout {

  constructor(userSession, router) {

    this.userSession = userSession;
    this.router = router;
  }

  activate() {

    this.userSession.handleLogout();
    location.reload();
  }
}
