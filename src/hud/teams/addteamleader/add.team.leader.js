/*
zailab
*/
import {AddTeamLeaderService} from './add.team.leader.service';
import {AddTeamLeaderStore} from './add.team.leader.store';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController, AddTeamLeaderService, AddTeamLeaderStore)
export class AddTeamLeader {

  constructor(controller, addTeamLeaderService, addTeamLeaderStore) {
    this.controller = controller;
    this.addTeamLeaderService = addTeamLeaderService;
    this.addTeamLeaderStore = addTeamLeaderStore;
  }
  
	teamLeaders = [];

	selectTeamLeader(user) {
    
    if(user.teamId) return;
    
		let found = false;
		
		for(var teamLeader in this.teamLeaders) {
			if(user.memberId === this.teamLeaders[teamLeader].memberId) {
				found = true;
			}
		}
		if(found === false) {
			this.teamLeaders.push(user);
		}
    this.searchText = null;
    this.addTeamLeaderStore.clearSearch();
    
	}

  search() {
    
    this.addTeamLeaderService.search(this.searchText);
  }

	removeSelectedTeamLeader(user) {
		let tmp = [];
		
		for(var teamLeader in this.teamLeaders) {
			if(user.userId !== this.teamLeaders[teamLeader].userId && this.teamLeaders[teamLeader].userId) {
				tmp.push(this.teamLeaders[teamLeader]);
			}
		}
		
		this.teamLeaders = tmp;
	}

  addTeamLeaders() {
    
    this.controller.ok(this.teamLeaders);
  }
}