/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {ViewConversationStore} from '../viewconversation.store';
import {ConversationStore} from '../../conversation.store';
import {ViewConversationService} from '../viewconversation.service';
import {VIEW_CONVERSATION_ACTIONS} from '../viewconversation.actions';
/*
 */
import {PeerService} from 'zailab.common';
/*
 */
const logger = LogManager.getLogger('CallView');
/*
*/
@inject(ViewConversationStore, ConversationStore, ViewConversationService, PeerService)
export class CallView {

  constructor(viewConversationStore, conversationStore, viewConversationService, peerService) {

    this.viewConversationStore = viewConversationStore;
    this.conversationStore = conversationStore;
    this.viewConversationService = viewConversationService;
    this.peerService = peerService;
  }

  activate(params) {

    let conversationId = params.conversationId;

    if(!this.conversationStore.isVideoConversation) {
      this.viewConversationService.view(null);
    }
    logger.debug('this.viewConversationStore.isVideoCallDisconnected >',this.viewConversationStore.isVideoCallDisconnected);
    //Must go through line below.  Added the not  infront. To be reviewed

/*    if(!this.viewConversationStore.isVideoCallDisconnected) {
    }*/
    this.viewConversationService.retrieveInteractionJourney(conversationId);
    this.viewConversationService.retrieveConversationJourney(conversationId);
    logger.debug('after inter journey');
  }

  attached() {

    $('#js-interactionJourney').bind('mousewheel', function(event) {

      let delta = event.originalEvent.wheelDelta;
      let scrollLeft = this.scrollLeft - (delta * 2);
      
      $('#js-interactionJourney').stop().animate({scrollLeft: scrollLeft}, 250);

      event.preventDefault();
    });
  }
  
  viewInteraction(waypoint, index) {
    
    this.viewConversationService.viewInteraction(waypoint, index);
  }

  endCall() {

    this.viewConversationService.disconnectVideoCall();
  }
  
  @handle(VIEW_CONVERSATION_ACTIONS.RETRIEVE_INTERACTION_JOURNEY)
  @waitFor(ViewConversationStore)
  handleRetrieveInteractionJourney(event, data) {

    if(data && data.interactionId){
      
      let interactionId = data.interactionId;
      this.viewConversationService.registerInteractionJourneyOplog(interactionId);
    }
  }
}
