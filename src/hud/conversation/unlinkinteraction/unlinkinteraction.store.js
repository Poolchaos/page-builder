/*
zailab
*/
import {UNLINK_INTERACTION_ACTIONS}  from './unlinkinteraction.actions';
import {DateTimeTools} from 'zailab.common';
/*
aurelia
*/
import {handle} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
/*
Logger
*/
const logger = LogManager.getLogger('UnlinkInteractionStore');
/*
the state is bound to the view via the store.
*/
let STATE = {

  interactions: [],
  selectedInteractions: []
};
/*
the store wraps the state to control how it is changed.
*/
@inject(DateTimeTools)
export class UnlinkInteractionStore {

  constructor(dateTimeTools) {

    this.dateTimeTools = dateTimeTools;
  }

  get interactions(){
    
    return STATE.interactions;
  }

  get selectedInteractions(){
    
    return STATE.selectedInteractions;
  }
  
  @handle(UNLINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS)
  handleRetrieveInteractions(event, interactions) {
    for (let interaction of interactions) {
			
			interaction.callOutcome = interaction.callOutcome ? interaction.callOutcome.toUpperCase() : '';
      interaction.startTime = interaction.timestamp === 0 ? '-' : this.dateTimeTools.convertToLocalTime(interaction.timestamp, 'UTC');
      interaction.duration = interaction.duration === 0 ? '-' : this.dateTimeTools.convertMillisecondsToTime(interaction.duration);
    }

    STATE.interactions = interactions;
  }

  @handle(UNLINK_INTERACTION_ACTIONS.SELECT_INTERACTION)
  handleSelectInteraction(action, updatedList) {
    
    STATE.selectedInteractions = updatedList;
  }

  @handle(UNLINK_INTERACTION_ACTIONS.ACTIVATE_VIEW)
  handleActivateView(action, updatedList) {

    STATE.selectedInteractions = [];
  }
}
