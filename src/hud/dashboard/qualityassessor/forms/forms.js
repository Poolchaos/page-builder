/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
const logger = LogManager.getLogger('Forms');
/*
*/
@inject(Router)
export class Forms {

  constructor(router){
    
    this.router = router;
  }
    
  configureRouter(config, router) {
    
    config.map([

      {route: '',                               redirect: 'list'},
      {route: '',                               name: 'list',   moduleId: 'hud/dashboard/qualityassessor/forms/list/list',       nav: false, title: 'Forms'},
      {route: 'create',                         name: 'create', moduleId: 'hud/dashboard/qualityassessor/forms/create/create',   nav: false, title: 'Create Form'},
      {route: 'view/:memberId',                 name: 'view',   moduleId: 'hud/dashboard/qualityassessor/forms/view/view',       nav: false, title: 'View Form'},
      {route: 'performedassessment/:assessmentId',  name: 'view',   moduleId: 'hud/dashboard/qualityassessor/forms/performedassessment/performedassessment', nav: false, title: 'Performed Assessment'}

    ]);

    this.router = router;
  }
  
}
