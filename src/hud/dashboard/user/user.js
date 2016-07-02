/*
*/
import {UserSession} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
const logger = LogManager.getLogger('User');
/*
*/
@inject(Router, UserSession)
export class User {

  constructor(router, userSession) {

    this.router = router;
    this.userSession = userSession;

  }

  configureRouter(config, router) {

    let map;

    if (!this.userSession.organisationId) {

      map = [{route: '',                   name: 'createorganisation', moduleId: 'hud/dashboard/user/createorganisation/user.createorganisation', nav: false, title: 'Create Organisation'},
             {route: 'profile',            name: 'profile',            moduleId: 'hud/dashboard/user/profile/user.profile',                       nav: false, title: 'Profile'}];

    }else {

      map = [{route: 'createorganisation', name: 'createorganisation', moduleId: 'hud/dashboard/user/createorganisation/user.createorganisation', nav: false, title: 'Create Organisation'},
             {route: 'profile',                   name: 'profile',            moduleId: 'hud/dashboard/user/profile/user.profile',                       nav: false, title: 'Profile'}];
    }
    config.map(map);

    this.router = router;
  }

  activate() {

  }

}
