/*
zailab
*/
import {UNLINK_INTERACTION_ACTIONS}  from './unlinkinteraction.actions';
import {HUD_ACTIONS}  from '../../hud.actions';
import {WebSocket, UserSession, UrlFactory, ApplicationService}  from 'zailab.common';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {HttpClient} from 'aurelia-http-client';
/*
Logger
*/
const logger = LogManager.getLogger('UnlinkInteractionService');
/*
*/
@inject(Dispatcher, WebSocket, UserSession, UrlFactory, HttpClient, ApplicationService)
export class UnlinkInteractionService {

  constructor(dispatcher, webSocket, userSession, urlFactory, httpClient, applicationService) {

    this.dispatcher = dispatcher;
    this.webSocket = webSocket;
    this.userSession = userSession;
    this.urlFactory = urlFactory;
    this.httpClient = httpClient;
    this.applicationService = applicationService;
    this.subscribe();
  }

  subscribe() {
    
    this.webSocket.subscribe({
      name: 'com.zailab.organisation.conversation.api.events.InteractionLinkedToConversationEvent',
      callback: data => {
        this.dispatcher.dispatch(UNLINK_INTERACTION_ACTIONS.LINK_INTERACTION, []);
      }
    });
  }

  activateView(){
    
    this.dispatcher.dispatch(UNLINK_INTERACTION_ACTIONS.ACTIVATE_VIEW);
  }
  
  retrieveInteractions(conversationId) {
    this.applicationService.unlinkInteractionsSearch(conversationId).then(
        response => {
          if (response.conversationInteractionsView && response.conversationInteractionsView[0]) {

            this.dispatcher.dispatch(UNLINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS, response.conversationInteractionsView);
            return;
          }

          this.dispatcher.dispatch(UNLINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS, []);
        },
        error => {

          this.dispatcher.dispatch(UNLINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS, []);
        }
    );
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
    this.dispatcher.dispatch(UNLINK_INTERACTION_ACTIONS.SELECT_INTERACTION, updatedList);
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
    this.dispatcher.dispatch(UNLINK_INTERACTION_ACTIONS.SELECT_INTERACTION, updatedList);
  }

}
