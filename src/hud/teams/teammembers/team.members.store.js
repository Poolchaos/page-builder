/*
aurelia
*/
import {handle} from 'aurelia-flux';
/*
zailab
*/
import {TEAM_MEMBERS_ACTIONS} from './team.members.actions';

export class TeamMembersStore {
  
  
  @handle(TEAM_MEMBERS_ACTIONS.TEAM_LEADERS_RETRIEVED)
  handleTeamLeadersRetrieved(action, teamLeaders) {
    this.teamLeaders = teamLeaders;
  }

  @handle(TEAM_MEMBERS_ACTIONS.TEAM_AGENTS_RETRIEVED)
  handleTeamAgentsRetrieved(action, teamAgents) {
    this.teamAgents = teamAgents;
  }

}