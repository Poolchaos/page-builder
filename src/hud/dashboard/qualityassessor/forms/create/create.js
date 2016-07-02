/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
import {WindowService} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('CreateForm');
/*
*/
@inject(Router, WindowService)
export class Create {
  
  constructor(router, windowService){
    
    this.router = router;
    this.windowService = windowService;
  }
  
  configureRouter(config, router) {
    
    config.map([

      {route: '',       redirect: 'name'},
      {route: 'name',       name: 'name',       moduleId: 'hud/dashboard/qualityassessor/forms/create/steps/name/name',           nav: false, title: 'Form Name'},
      {route: 'questions',  name: 'questions',  moduleId: 'hud/dashboard/qualityassessor/forms/create/steps/questions/questions', nav: false, title: 'Form Questions'}
      
    ]);

    this.router = router;
  }
  
  activate(){

    this.windowService.disableUnload();
  }
  
  deactivate(){
    
    this.windowService.enableUnload();
  }
  
}
