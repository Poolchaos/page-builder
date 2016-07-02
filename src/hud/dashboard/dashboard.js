/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
 */
import {UserSession} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('Dashboard');
/*
*/
@inject(Router, UserSession)
export class Dashboard {

  constructor(router, userSession) {

    this.router = router;
    this.userSession = userSession;
  }
  
  get isOrganisationBlocked() {
    
    let isOrganisationBlocked = this.userSession.isAdminRole ? false : this.userSession.isAgentRole || this.userSession.isTeamLeaderRole || this.userSession.isOfficeEmployeeRole ? true : false;

    return isOrganisationBlocked;
  }

  configureRouter(config, router) {
    
    config.map([

      {route: '',                redirect: 'user'},
      {route: 'user',            name: 'user',            moduleId: 'hud/dashboard/user/user',                       nav: false,  title: 'User'}, // TODO does this require a role?
      
      {route: 'members',         name: 'members',         moduleId: 'hud/dashboard/members/organisation.members',    nav: false,  title: 'Members'},
      {route: 'mailbox',         name: 'mailbox',         moduleId: 'hud/dashboard/mailbox/mailbox.messages',        nav: false,  title: 'MailBox'}, // TODO does this require a role?
      
      {route: 'organisation',    name: 'organisation',    moduleId: 'hud/dashboard/organisation/organisation',       nav: false,  title: 'Organisation',      isBlocked: this.isOrganisationBlocked},
      {route: 'agent',           name: 'agent',           moduleId: 'hud/dashboard/agent/agent',                     nav: false,  title: 'Agent',             isBlocked: !this.userSession.isAgentRole},
      {route: 'teamleader',      name: 'teamleader',      moduleId: 'hud/dashboard/teamleader/teamleader',           nav: false,  title: 'Team Leader',       isBlocked: !this.userSession.isTeamLeaderRole},
//      {route: 'officeemployee',  name: 'officeemployee',  moduleId: 'hud/dashboard/members/organisation.members',    nav: false,  title: 'Office Employee',   isBlocked: !this.userSession.isOfficeEmployeeRole},
      {route: 'qualityassessor', name: 'qualityassessor', moduleId: 'hud/dashboard/qualityassessor/qualityassessor', nav: false,  title: 'Quality Assessor',  isTwelveColumnRoute: true} // TODO - requires role
    ]);

    this.router = router;
  }
}
