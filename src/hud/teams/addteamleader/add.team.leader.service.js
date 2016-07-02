/*
zailab
*/
import {ADD_TEAM_LEADER_ACTIONS} from './add.team.leader.actions';
import {ApplicationService} from '../../../_common/services/application.service';
import {TeamsStore} from '../teams.store';
import {UserSession} from '../../../_common/stores/user.session';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';

@inject(Dispatcher, ApplicationService, TeamsStore, UserSession)
export class AddTeamLeaderService {
  
  constructor(dispatcher, applicationService, teamsStore, userSession) {
    
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.teamsStore = teamsStore;
    this.userSession = userSession;
  }
  
  search(searchText) {
    
    if(searchText.length === 0) return;
    
    let organisationId = '';
    
    for(var item in this.userSession.user.userAccessRoles) {
      
      if(this.userSession.user.userAccessRoles[item].accountType === 'ORGANISATION') {
        
        organisationId = this.userSession.user.userAccessRoles[item].ownerId;
      }
    }
    
    this.applicationService.displayOrganisationTeamLeadersSearch(organisationId, searchText)
      .then(
           response => {
             let teamLeaders = response.displayOrganisationTeamLeadersViews;
             this.dispatcher.dispatch(ADD_TEAM_LEADER_ACTIONS.SEARCH_RESULTS_RETRIEVED, teamLeaders);
         },
         error => {
//           this.dispatcher.dispatch();
         }
       )
     ;	
  }
  
}