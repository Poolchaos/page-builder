/*
zailab
*/
import {ADD_TEAM_AGENT_ACTIONS} from './add.team.agent.actions';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {handle} from 'aurelia-flux';

@inject()
export class AddTeamAgentStore {
  
  clearSearch() {
    
    this.searchResults = [];
  }
  
  @handle(ADD_TEAM_AGENT_ACTIONS.SEARCH_RESULTS_RETRIEVED)
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
   
  @handle(ADD_TEAM_AGENT_ACTIONS.AGENTS_NOT_SELECTED)
  handleAgentsNotSelected(action, error) {
    
    this.error = error;
  }
}