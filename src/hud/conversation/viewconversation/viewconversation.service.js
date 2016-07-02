/*
 zailab
 */
import {ViewConversationDatabaseService}  from './viewconversation.database.service';
import {VIEW_CONVERSATION_ACTIONS}  from './viewconversation.actions';
import {CONVERSATION_ACTIONS}  from '../conversation.actions';
import {HUD_ACTIONS} from '../../hud.actions';
import {UserSession, ApplicationService, PeerService, PEER_SERVICE_EVENTS, UrlFactory, ApplicationProperties, WebSocket, WebSocketKiosk, InteractionService}  from 'zailab.common';
/*
 aurelia
 */
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
import {HttpClient} from 'aurelia-http-client';
/*
 Logger
 */
const logger = LogManager.getLogger('ViewConversationService');
/*
 the action dispatcher will dispatch actions privately
 */
let videoCallActionDispatcher = null;
/*
 Video Call Service
 */
@inject(ViewConversationDatabaseService, UserSession, ApplicationService, Dispatcher, PeerService, EventAggregator, WebSocket, WebSocketKiosk, InteractionService, UrlFactory, ApplicationProperties, HttpClient)
export class ViewConversationService {

  constructor(viewConversationDatabaseService, userSession, applicationService, dispatcher, peerService, eventAggregator, webSocket, webSocketKiosk, interactionService, urlFactory, applicationProperties, httpClient) {

    videoCallActionDispatcher = new VideoCallActionDispatcher(dispatcher);

    this.viewConversationDatabaseService = viewConversationDatabaseService;
    this.userSession = userSession;
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.peerService = peerService;
    this.eventAggregator = eventAggregator;
    this.webSocket = webSocket;
    this.webSocketKiosk = webSocketKiosk;
    this.interactionService = interactionService;
    this.urlFactory = urlFactory;
    this.applicationProperties = applicationProperties;
    this.httpClient = httpClient;
  }

  registerConversationJourneyOplog(conversationId) {

    this.viewConversationDatabaseService.onConversationJourneyUpdated(conversationId, data => {

      let waypoints = data.waypoints;
      this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_JOURNEY, waypoints);
    });
  }

  registerInteractionJourneyOplog(interactionId) {

    this.viewConversationDatabaseService.onContactJourneyUpdated(interactionId, data => {

      let waypoints = data.waypoints;
      this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_INTERACTION_JOURNEY, {interactionId:interactionId, waypoints:waypoints});

    });
  }

  activateVideoCall() {

    if (!this.peerService.remoteStream) {

      setTimeout(() => {

        this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_DISCONNECTED);
      }, 50);
      return;
    }

    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_DISCONNECTED, () => {

      videoCallActionDispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.DISCONNECT_VIDEO_CALL);
    });

    this.toggleVideoMode(false);

    //    this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_VIDEO_TOGGLE, false);
    videoCallActionDispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.CONNECT_VIDEO_CALL);
  }

  toggleVideoMode(val) {

    this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_VIDEO_TOGGLE, val);
  }

  disconnectVideoCall() {

    this.peerService.endCall();

    videoCallActionDispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.DISCONNECT_VIDEO_CALL);
  }

  retrieveConversationAttributes(conversationId) {

    let organisationId = this.userSession.organisationId;

    this.applicationService.displayConversationAttributesSearch(organisationId, conversationId).then(response=> {

      if (response.conversationContactsView && response.conversationContactsView) {

        logger.debug('convo attribuites > ', response);

        this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_ATTRIBUTES, response.conversationContactsView);
        return;
      }

      this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_ATTRIBUTES, {});

    });

  }

  retrieveConversationCardView(conversationId) {
    this.applicationService.displayConversationCardSearch(conversationId).then(response=> {

      if (response && response.conversationCardView) {

        this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_CARD_ATTRIBUTES, response.conversationCardView[0]);
        return;
      }

      this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_CARD_ATTRIBUTES, {});

    });
  }

  downloadZip() {

    this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.DOWNLOAD_ZIP, {});
  }

  retrieveConversationJourney(conversationId) {
    this.applicationService.conversationJourneyViewSearch(conversationId).then(response=> {
      if (response.conversationJourneyView && response.conversationJourneyView[0]) {

        let waypoints = response.conversationJourneyView[0].waypoints;
        this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_JOURNEY, waypoints);
        return;
      }
      this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_CONVERSATION_JOURNEY, []);
    });


  }

  retrieveInteractionJourney(conversationId) {

    let memberId = this.userSession.memberId;

    this.applicationService.interactionJourneyViewSearch(conversationId).then(response=> {

      if (response.contactJourneyView && response.contactJourneyView[0]) {

        let interactionId = response.contactJourneyView[0].interactionId;
        let waypoints = response.contactJourneyView[0].waypoints;
        this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_INTERACTION_JOURNEY, {interactionId:interactionId, waypoints:waypoints});
        return;
      }

      this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_INTERACTION_JOURNEY, []);
    });

  }

  view(tab) {

    this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.TAB_NAVIGATE, tab);
  }

  changeConversationName(conversationName, conversationId){

    logger.debug('change conversation name ', {name:name, conversationId:conversationId});

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.conversation.api.commands.ChangeConversationNameCommand',
      state: {
        conversationName: conversationName,
        conversationId: conversationId
      }
    };

    this.webSocket.publish(message);
  }

  setVideoWrapupState() {

    this.dispatcher.dispatch(CONVERSATION_ACTIONS.CONVERSATION_WRAPUP);
  }

  replyToMessage(message, toNumber) {

    logger.debug(' replyToMessage >>> message = ', message, ' toNumber = ', toNumber);

    this.interactionService.startInteraction(message, toNumber, this.userSession.loggedInUser.userId);
  }

  retrieveChannels() {

    logger.debug('this.userSession >>>> ', this.userSession.user);

    let disableSMSChannel = this.userSession.isSMSAllowed ? false : true;
    
    logger.debug('disableSMSChannel >>>> ', disableSMSChannel);
            
    this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.RETRIEVE_ORGANISATION_CHANNELS, [{
        channelName: 'CALL'
      }, {
        channelName: 'SMS',
        disabled: disableSMSChannel
      }, {
        channelName: 'EMAIL',
        disabled: true
      }, {
        channelName: 'FACEBOOK',
        disabled: true
      }, {
        channelName: 'TWITTER',
        disabled: true
      }]);
    
  }

  finish() {

    this.dispatcher.dispatch(HUD_ACTIONS.NAV_HOME, true);
  }
  
  dial(source, destination) {
    
    let host = this.applicationProperties.apiRouterEndpoint;
    let url = this.urlFactory.buildUrl(host, `telephony/${source}/makecall/${destination}`);
    
    logger.debug(' dialling >>> ', url);
    
    this.httpClient.post(url, {}).then(
      (response) => {
        logger.debug(response);
      },
      (error) => {
        logger.debug(error);
      }
    );
  }
  
  viewInteraction(waypoint, index) {
    
    this.dispatcher.dispatch(VIEW_CONVERSATION_ACTIONS.VIEW_INTERACTION, {waypoint: waypoint, index: index});
  }

}

class VideoCallActionDispatcher {

  dispatch;

  constructor(dispatcher) {
    this.dispatch = dispatcher.dispatch;
  }
}
/*
 */
function resolveChannelsResponse(response) {

  let channels = [];

  if (response.displayChannelsView) {

    channels = response.displayChannelsView;
  }

  return channels;
}
