/*
zailab
*/
import {ADD_TEAM_AGENT_ACTIONS} from './add.team.agent.actions';
import {ApplicationService} from '../../../_common/services/application.service';
import {TeamsStore} from '../teams.store';
import {UserSession} from '../../../_common/stores/user.session';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';

@inject(Dispatcher, ApplicationService, TeamsStore, UserSession)
export class AddTeamAgentService {
  
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
    
    this.applicationService.displayOrganisationAgentsSearch(organisationId, searchText)
      .then(
         response => {

           let teamAgents = response.displayOrganisationAgentsViews;
           this.dispatcher.dispatch(ADD_TEAM_AGENT_ACTIONS.SEARCH_RESULTS_RETRIEVED, teamAgents);
         },
         error => {
//           this.dispatcher.dispatch();
         }
       )
     ;
    
	
  }
  
}