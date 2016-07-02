import {inject, LogManager} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {AddTeamLeader} from '../addteamleader/add.team.leader';
import {AddTeamAgent} from '../addteamagent/add.team.agent';
import {TeamMembersStore} from './team.members.store';
import {TeamMembersService} from './team.members.service';
import {Router} from 'aurelia-router';
//import {ADD_TEAM_AGENT_ACTIONS} from '../addteamagent/add.team.agent.actions';
//import {ADD_TEAM_LEADER_ACTIONS} from '../addteamleader/add.team.leader.actions';
//import {handle} from 'aurelia-flux';

@inject(DialogService, TeamMembersStore, TeamMembersService, Router)
export class TeamMembers {

  constructor(dialogService, teamMembersStore, teamMembersService, router) {
    
    this.dialogService = dialogService;
    this.teamMembersStore = teamMembersStore;
    this.teamMembersService = teamMembersService;
    this.router = router;
  }
  
  activate() {
  
    this.teamMembersService.retrieveTeamMembers();
  }

  displayAddTeamLeader() {
    
    this.dialogService.open({
      viewModel: AddTeamLeader,
      model: this
    }).then(response => {
      
      if (!response.wasCancelled) { 
        
        var teamLeaders = response.output;
        
        this.teamMembersService.addTeamLeaders(teamLeaders);
        
      } else {
        // TODO handle Cancel
      }
    
//        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      })
    ;
    
//    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }


  displayAddAgent() {
    
    this.dialogService.open({
      viewModel: AddTeamAgent,
      model: this
    }).then(response => {
      
      if (!response.wasCancelled) {
        
        var agents = response.output;
        
        this.teamMembersService.addAgents(agents);
        
      } else {
        // TODO handle Cancel
      }
    
//        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      })
    ;
    
//    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }
  
  leaveTeamMembers() {
    
    this.router.navigate('teams');
  }

//  @handle(ADD_TEAM_AGENT_ACTIONS.AGENTS_ADDED_TO_TEAM)
//  handleAgentAddedToTeam() {
//    
//    this.controller.cancel();
//  }
//
//  @handle(ADD_TEAM_LEADER_ACTIONS.TEAM_LEADERS_ADDED_TO_TEAM)
//  handleTeamLeadersAddedToTeam() {
//    
//    this.controller.cancel();
//  }

}
