/*
*/
import {Router} from 'aurelia-router';
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('Teamleader');

@inject(Router)
export class Teamleader {
  
  constructor(router) {
    
    this.router = router;
  }
  
  configureRouter(config, router) {

    let routeMap = [
      {route: '',                   name: 'agents',              moduleId: 'hud/dashboard/teamleader/agents/agents',                            nav: false, title: 'Agents'},
      {route: 'calllogs',           name: 'calllogs',            moduleId: 'hud/dashboard/teamleader/calllogs/call.history',                    nav: false, title: 'Call Logs'},
      {route: 'livedashboard',      name: 'livedashboard',       moduleId: 'hud/dashboard/teamleader/livedashboard/live.dashboard',             nav: false, title: 'Live Dashboard'},
      {route: 'workforcedashboard', name: 'workforcedashboard',  moduleId: 'hud/dashboard/teamleader/workforcedashboard/workforce.dashboard',   nav: false, title: 'Workforce Dashboard'},
      {route: 'members',            name: 'members',             moduleId: 'hud/dashboard/teamleader/members/organisation.members',             nav: false, title: 'Members'}
    ];

    config.map(routeMap);
    this.router = router;

  }
    
}