/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
zailab
*/
import {TEAMS_ACTIONS} from './teams.actions';

@inject(Router)
export class TeamsStore {
  
  constructor(router) {
    this.router = router;
  }
  
  teams = [];
  
  @handle(TEAMS_ACTIONS.TEAMS_RETRIEVED)
  handleTeamsRetrieved(action, teams) {
    this.teams = teams;
  }

   //TODO: remove this when db op works
  @handle(TEAMS_ACTIONS.TEAMS_ADDED_SUCCESSFUL)
  handleTeamsCreated(action, data) {
    
    this.teams.push(data.state);
  }

  @handle(TEAMS_ACTIONS.TEAM_SELECTED)
  handleTeamSelected(action, team) {
    
    this.selectedTeam = team;
    this.router.navigate('hud/teamMembers');
  }
}