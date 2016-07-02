/*
zailab
*/
import {ADD_TEAM_ACTIONS} from './add.team.actions';
import {ApplicationService} from '../../../_common/services/application.service';
import {UserSession} from '../../../_common/stores/user.session';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
node
*/
import uuid from 'node-uuid';

@inject(Dispatcher, UserSession, ApplicationService)
export class AddTeamService {
  
  constructor(dispatcher, userSession, applicationService) {
    
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.applicationService = applicationService;
    this.registerEvents();
  }
  
  registerEvents() {
    
    this.applicationService.onTeamCreated(data => {
      
      this.dispatcher.dispatch(ADD_TEAM_ACTIONS.TEAM_ADDED_SUCCESSFUL, data);
    });
  }
  
  addTeam(team) {
    
    if(!team || !team.name) {
     
      return;
    }
    
    let organisationId = '';
    
    for(var item in this.userSession.user.userAccessRoles) {
      
      if(this.userSession.user.userAccessRoles[item].accountType === 'ORGANISATION') {
        
        organisationId = this.userSession.user.userAccessRoles[item].ownerId;
      }
    }
    
    this.applicationService.createTeam(organisationId, uuid.v4(), team.name);
  }
}