/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
import {SortTools} from 'zailab.common';
/*
*/
import {AGENTS_ACTIONS} from './agents.actions';
/*
*/
const logger = LogManager.getLogger('DashboardStore');
/*
STATE
*/
let STATE = {
  agents: [],
  agentSnooping: null
};

export class AgentsStore {
  
  get agents(){

    return STATE.agents.sort(SortTools.compareBy('firstName'));
  }
  
  get agentSnooping(){
    
    return STATE.agentSnooping;
  }
  
  @handle(AGENTS_ACTIONS.RETRIEVE_AGENTS_SUCCESS)
  handleRetrieveAgentsSuccess(action, response){
   
    STATE.agentSnooping = false;
    if (response.teamleadersSnooping){

      
      for(let teamleader of response.teamleadersSnooping){

        if(teamleader.memberId === response.memberId){
          STATE.agentSnooping = true;
          logger.debug('teamleader busy snoop dawging -> ', teamleader.memberId );
        }
      }
    }
    
    for(let agent of response.agents) {
      
      agent.text = `${agent.firstName} ${agent.surname}`;
    }
    
    STATE.agents = response.agents;
  }
  
}