/*
zailab
*/
import {ADD_TEAM_LEADER_ACTIONS} from './add.team.leader.actions';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class AddTeamLeaderStore {
  
  constructor(controller) {
    this.controller = controller;
  }
  
  clearSearch() {
    
    this.searchResults = [];
  }
  
  @handle(ADD_TEAM_LEADER_ACTIONS.SEARCH_RESULTS_RETRIEVED)
  handleSearchReslutsRetrieved(action, searchResults) {
    
    let areMembers = [];
    let notMembers = [];
    
    for(var result in searchResults) {
      if(searchResults[result].isMember) {
        
        areMembers.push(searchResults[result]);
      } else {
        
        notMembers.push(searchResults[result]);
      }
    }
    this.searchResults = notMembers.concat(areMembers);
  }
   
  @handle(ADD_TEAM_LEADER_ACTIONS.TEAM_LEADERS_NOT_SELECTED)
  handleTeamLeadersNotSelected(action, error) {
    
    this.error = error;
  }
}