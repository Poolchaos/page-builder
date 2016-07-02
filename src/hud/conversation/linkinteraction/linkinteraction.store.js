/*
zailab
*/
import {LINK_INTERACTION_ACTIONS}  from './linkinteraction.actions';
import {DateTimeTools} from 'zailab.common';
/*
aurelia
*/
import {handle} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
/*
Logger
*/
const logger = LogManager.getLogger('LinkInteractionStore');
/*
the state is bound to the view via the store.
*/
let STATE = {

  interactions: [],
  disableViewOnly: false
};
/*
the store wraps the state to control how it is changed.
*/
@inject(DateTimeTools)
export class LinkInteractionStore {

  constructor(dateTimeTools) {

    this.dateTimeTools = dateTimeTools;
  }

  get interactions(){
    
    return STATE.interactions;
  }

  get selectedInteractions(){
    
    return STATE.selectedInteractions;
  }
  
  get disableViewOnly(){
    
    return STATE.disableViewOnly;
  }
  
  @handle(LINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS)
  handleRetrieveInteractions(event, interactions) {
    logger.debug('interactions >>>>', interactions);
    if(!interactions) {
      return;
    }

    for (let interaction of interactions) {
      
			interaction.callOutcome = interaction.callOutcome ? interaction.callOutcome.toUpperCase() : '';
      interaction.startTime = interaction.timestamp === 0 ? '-' : this.dateTimeTools.convertToLocalTime(interaction.timestamp, 'UTC');
      interaction.duration = interaction.duration === 0 ? '-' : this.dateTimeTools.convertMillisecondsToTime(interaction.duration);
    }

    STATE.interactions = interactions;
  }

  @handle(LINK_INTERACTION_ACTIONS.SELECT_INTERACTION)
  handleSelectInteraction(action, updatedList) {
    
    STATE.selectedInteractions = updatedList;
  }

  @handle(LINK_INTERACTION_ACTIONS.UPDATE_INTERACTION)
  handleUpdateInteraction(action, updatedInteraction) {
    
    let updatedInteractionId = updatedInteraction._id;
    
    for(let interaction of STATE.interactions){
      
      if(interaction.interactionId === updatedInteractionId){
        interaction.onCall = updatedInteraction.onCall;
      }
    }
        
  }

  @handle(LINK_INTERACTION_ACTIONS.INSERT_INTERACTION)
  handleInsertInteraction(action, insertedInteraction) {
    
    for(let interaction of STATE.interactions){
      if(interaction.interactionId === insertedInteraction._id){
        return;
      }
    }

    insertedInteraction.callOutcome = insertedInteraction.callOutcome ? insertedInteraction.callOutcome.toUpperCase() : '';
    insertedInteraction.startTime = insertedInteraction.timestamp === 0 ? '-' : this.dateTimeTools.convertToLocalTime(insertedInteraction.timestamp, 'UTC');
    insertedInteraction.duration = insertedInteraction.duration === 0 ? '-' : this.dateTimeTools.convertMillisecondsToTime(insertedInteraction.duration);

    STATE.interactions.unshift(insertedInteraction);
  }

  @handle(LINK_INTERACTION_ACTIONS.ACTIVATE_VIEW)
  handleActivateView(action, disableViewOnly) {

    STATE.disableViewOnly = disableViewOnly;
    STATE.selectedInteractions = [];
  }

  @handle(LINK_INTERACTION_ACTIONS.DEACTIVATE_VIEW)
  handleDeactivateView() {

    STATE.disableViewOnly = true;
    STATE.selectedInteractions = [];
  }
}
