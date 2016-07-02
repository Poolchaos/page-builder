/*
zailab
*/
import {TEAMS_ACTIONS} from './teams.actions';
import {ApplicationService} from '../../_common/services/application.service';
import {UserSession} from '../../_common/stores/user.session';
import {DatabaseService} from '../../_common/services/database.service';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';

const logger = LogManager.getLogger('TeamsService');

@inject(Dispatcher, ApplicationService, UserSession, DatabaseService)
export class TeamsService {

  constructor(dispatcher, applicationService, userSession, databaseService) {
    
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.databaseService = databaseService;
    this.subscribeToEvents();
  }
  
  subscribeToEvents() {
    
    let organisationId = '';
    
    for(var item in this.userSession.user.userAccessRoles) {
      
      if(this.userSession.user.userAccessRoles[item].accountType === 'ORGANISATION') {
        
        organisationId = this.userSession.user.userAccessRoles[item].ownerId;
      }
    }
    
    this.databaseService.onTeamCreated(organisationId, data => { 
      
      this.dispatcher.dispatch(TEAMS_ACTIONS.TEAMS_RETRIEVED, data.teams);
    });
  }
  
  retrieveTeams() {
    
    let organisationId = '';
    let teams = [];
    
    for(var item in this.userSession.user.userAccessRoles) {
      
      if(this.userSession.user.userAccessRoles[item].accountType === 'ORGANISATION') {
        
        organisationId = this.userSession.user.userAccessRoles[item].ownerId;
      }
    }
  
//    this.applicationService.displayOrganisationTeamTeams('72b434c8-ca75-11e5-9956-625662870761')
    this.applicationService.displayOrganisationTeamTeams(organisationId)
       .then(
           response => {
             if(response && response.displayTeamsView && response.displayTeamsView[0]) {
             
               teams = response.displayTeamsView[0].teams;
               
               this.dispatcher.dispatch(TEAMS_ACTIONS.TEAMS_RETRIEVED, teams);
             }
         },
         error => {
//           this.dispatcher.dispatch();
         }
       )
     ;
//    
//    teams = [{
//      teamName: 'Team A',
//      teamId: '123-456-789'
//    }, {
//      teamName: 'Team B',
//      teamId: '123-456-000'
//    }, {
//      teamName: 'Team C',
//      teamId: '123-456-555'
//    }];
//    this.dispatcher.dispatch(TEAMS_ACTIONS.TEAMS_RETRIEVED, teams); 
  }

}