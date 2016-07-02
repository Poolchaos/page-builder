/*
zailab
*/
import {TEAM_MEMBERS_ACTIONS} from './team.members.actions';
import {ApplicationService} from '../../../_common/services/application.service';
import {UserSession} from '../../../_common/stores/user.session';
import {DatabaseService} from '../../../_common/services/database.service';
import {TeamsStore} from '../teams.store';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';

const logger = LogManager.getLogger('TeamsService');

@inject(Dispatcher, ApplicationService, UserSession, DatabaseService, TeamsStore)
export class TeamMembersService {
  
  constructor(dispatcher, applicationService, userSession, databaseService, teamsStore) {
    
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.databaseService = databaseService;
    this.teamsStore = teamsStore;
    
    this.subscribeToEvents();
  }
  
  subscribeToEvents() {
    
    if(!this.teamsStore.selectedTeam) return;
    this.databaseService.onTeamMemberAdded(this.teamsStore.selectedTeam.teamId, data => { 
      
      this.setTeamMemberData(data);
    });
  }
  
  retrieveTeamMembers() {
    
    if(!this.teamsStore.selectedTeam) return;
    
    let teamId = this.teamsStore.selectedTeam.teamId;
    
    this.applicationService.displayOrganisationTeamTeamMembers(teamId)
      .then(
        response => {
          
          this.setTeamMemberData(response.displayTeamMembersView[0]);
        },
        error => {
        
        }
      );
  }
  
  setTeamMemberData(data) {

    this.dispatcher.dispatch(TEAM_MEMBERS_ACTIONS.TEAM_LEADERS_RETRIEVED, data.teamLeaders);
    this.dispatcher.dispatch(TEAM_MEMBERS_ACTIONS.TEAM_AGENTS_RETRIEVED, data.agents);
  }
  
  addTeamLeaders(teamLeaders) {
    
    if(teamLeaders.length === 0) {
      
      this.dispatcher.dispatch(TEAM_MEMBERS_ACTIONS.TEAM_MEMBER_NOT_SELECTED, 'Please select a team leader before continuing.');
      return;
    }
    
    for(var teamLeader in teamLeaders) {
      
      if(!teamLeaders[teamLeader].memberId) {
        continue;
      }
      
      let teamId = this.teamsStore.selectedTeam.teamId;
      let memberId = teamLeaders[teamLeader].memberId;
      let firstName = teamLeaders[teamLeader].firstName ? teamLeaders[teamLeader].firstName : '';
      let surname = teamLeaders[teamLeader].surname ? teamLeaders[teamLeader].surname : '';
      let profilePicture = teamLeaders[teamLeader].profilePicture ? teamLeaders[teamLeader].profilePicture : '';
      
      this.applicationService.addTeamLeaderToTeam(teamId, memberId, firstName, surname, profilePicture);
    }    
  }
  
  addAgents(agents) {
    
    if(agents.length === 0) {
      
      this.dispatcher.dispatch(TEAM_MEMBERS_ACTIONS.TEAM_MEMBER_NOT_SELECTED, 'Please select an agent before continuing.');
      return;
    }
    
    for(var agent in agents) {
      
      if(!agents[agent].memberId) {
        continue;
      }
      
      let teamId = this.teamsStore.selectedTeam.teamId;
      let memberId = agents[agent].memberId;
      let firstName = agents[agent].firstName ? agents[agent].firstName : '';
      let surname = agents[agent].surname ? agents[agent].surname : '';
      let profilePicture = agents[agent].profilePicture ? agents[agent].profilePicture : '';
      
      this.applicationService.addAgentToTeam(teamId, memberId, firstName, surname, profilePicture);
    }
  }
}