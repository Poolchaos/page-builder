/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
 */
import {UserSession} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('QualityAssessor');
/*
*/
@inject(Router, UserSession)
export class QualityAssessor {

  constructor(router, userSession) {

    this.router = router;
  }
  
  configureRouter(config, router) {
    
    config.map([

      {route: '',                                               redirect: 'teams'},
      {route: 'teams',                                          name: 'teams',       moduleId: 'hud/dashboard/qualityassessor/teams/teams',            nav: false, title: 'Teams'},
      {route: 'forms',                                          name: 'forms',       moduleId: 'hud/dashboard/qualityassessor/forms/forms',            nav: false, title: 'Forms', isWingsHidden: true},
      {route: 'assessment/:interactionId',                      name: 'assessment',  moduleId: 'hud/dashboard/qualityassessor/assessment/assessment',  nav: false, title: 'Assessment', isWingsHidden: true}
    ]);

    this.router = router;
  }
}
