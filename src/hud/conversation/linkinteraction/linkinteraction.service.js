/*
zailab
*/
import {LINK_INTERACTION_ACTIONS}  from './linkinteraction.actions';
import {LinkInteractionDatabaseService}  from './linkinteraction.database.service';
import {WebSocket, UserSession, ApplicationService}  from 'zailab.common';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
Logger
*/
const logger = LogManager.getLogger('LinkInteractionService');
/*
*/
@inject(LinkInteractionDatabaseService, Dispatcher, WebSocket, UserSession, ApplicationService)
export class LinkInteractionService {

  constructor(linkInteractionDatabaseService, dispatcher, webSocket, userSession, applicationService) {

    this.linkInteractionDatabaseService = linkInteractionDatabaseService;
    this.dispatcher = dispatcher;
    this.webSocket = webSocket;
    this.userSession = userSession;
    this.applicationService = applicationService;
    this.subscribe();
  }

  subscribe() {
    
    let memberId = this.userSession.memberId;
    
    this.webSocket.subscribe({
      name: 'com.zailab.organisation.conversation.api.events.InteractionLinkedToConversationEvent',
      callback: data => {
        this.dispatcher.dispatch(LINK_INTERACTION_ACTIONS.LINK_INTERACTION, []);
      }
    });
    
    this.linkInteractionDatabaseService.onInteractionUpdated(memberId, data => this.dispatcher.dispatch(LINK_INTERACTION_ACTIONS.UPDATE_INTERACTION, data));        
  }

  activateView(disableViewOnly){
    
    this.dispatcher.dispatch(LINK_INTERACTION_ACTIONS.ACTIVATE_VIEW, disableViewOnly);
  }
  
  deactivateView(){
    
    this.dispatcher.dispatch(LINK_INTERACTION_ACTIONS.DEACTIVATE_VIEW);
  }
  
  retrieveInteractions() {

    let memberId = this.userSession.memberId;
    let organisationId = this.userSession.organisationId;
    
    this.applicationService.interactionListViewSearch(memberId, organisationId).then(
     response => {

       if (response && response.interactionListViews) {

        this.dispatcher.dispatch(LINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS, response.interactionListViews);
       } else {

        this.dispatcher.dispatch(LINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS, []);
       }
       
     });

  }

  linkInteraction(conversationId, interactionId, updatedList) {

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.conversation.api.commands.LinkInteractionToConversationCommand',
      state: {
        conversationId: conversationId,
        interactionId: interactionId
      }
    };

    this.webSocket.publish(message);
    this.dispatcher.dispatch(LINK_INTERACTION_ACTIONS.SELECT_INTERACTION, updatedList);
  }
  
  unlinkInteraction(conversationId, interactionId, updatedList) {

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.conversation.api.commands.UnlinkInteractionFromConversationCommand',
      state: {
        conversationId: conversationId,
        interactionId: interactionId
      }
    };

    this.webSocket.publish(message);
    this.dispatcher.dispatch(LINK_INTERACTION_ACTIONS.SELECT_INTERACTION, updatedList);
  }

}
