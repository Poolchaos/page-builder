/*
zailab
*/
import {TeamsStore} from '../teams.store';
import {AddTeamService} from './add.team.service';
import {ADD_TEAM_ACTIONS} from './add.team.actions';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {handle} from 'aurelia-flux';

@inject(AddTeamService, DialogController)
export class AddTeam {
  
  constructor(addTeamService, controller) {
    this.addTeamService = addTeamService;
    this.controller = controller;
  }
  
  @handle(ADD_TEAM_ACTIONS.TEAM_ADDED_SUCCESSFUL)
  handleTeamAddedSuccessful() {
    this.controller.cancel();
  }
  
  addTeam() {
      
    this.addTeamService.addTeam(this.team);
  }
}