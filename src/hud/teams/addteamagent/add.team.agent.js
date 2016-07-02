/*
zailab
*/
import {AddTeamAgentService} from './add.team.agent.service';
import {AddTeamAgentStore} from './add.team.agent.store';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController, AddTeamAgentService, AddTeamAgentStore)
export class AddTeamAgent {

  constructor(controller, addTeamAgentService, addTeamAgentStore) {
    this.controller = controller;
    this.addTeamAgentService = addTeamAgentService;
    this.addTeamAgentStore = addTeamAgentStore;
  }
  
	agents = [];

	selectAgent(user) {
    
    
    if(user.teamId) return;
    
		let found = false;
		
		for(var agent in this.agents) {
			if(user.memberId === this.agents[agent].memberId) {
				found = true;
			}
		}
		if(found === false) {
			this.agents.push(user);
		}
    
    this.searchText = null;
    this.addTeamAgentStore.clearSearch();
	}

  search() {
    
    this.addTeamAgentService.search(this.searchText);
  }

	removeSelectedAgent(user) {
		let tmp = [];
		
		for(var agent in this.agents) {
			if(user.userId !== this.agents[agent].userId && this.agents[agent].userId) {
				tmp.push(this.agents[agent]);
			}
		}
		
		this.agents = tmp;
	}

  addAgents() {
    
    this.controller.ok(this.agents);
  }
}