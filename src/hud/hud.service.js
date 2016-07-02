import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {HUD_ACTIONS} from './hud.actions';
import {LOGIN_ACTIONS} from '../onboarding/login/login.actions';
import {HudDatabaseService} from './hud.database.service';
import {WebSocket} from '../_common/services/websocket';
/*
*/
import {ApplicationService, UserSession, PeerService, PEER_SERVICE_EVENTS, DraggableService, MESSAGE_EVENTS} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('HeadsUpDisplayService');
/*
*/
@inject(ApplicationService, Dispatcher, HudDatabaseService, UserSession, WebSocket, EventAggregator, PeerService, DraggableService)
export class HeadsUpDisplayService {

  constructor(applicationService, dispatcher, hudDatabaseService, userSession, webSocket, eventAggregator, peerService, draggableService) {
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.hudDatabaseService = hudDatabaseService;
    this.userSession = userSession;
    this.webSocket = webSocket;
    this.eventAggregator = eventAggregator;
    this.peerService = peerService;
    this.draggableService = draggableService;
  }
  
  registerEvents() {

    let userid = this.userSession.user.userId;
    let personid = this.userSession.user.personId;

    this.hudDatabaseService.onStatusChanged(userid, response => {
      this.dispatcher.dispatch(HUD_ACTIONS.AGENT_STATUS_LOGGED, response.status);
    });

    this.applicationService.onStatusChanged(event => {
      logger.debug('EVENT >> onStatusChanged > event = ', event);
      this.dispatcher.dispatch(HUD_ACTIONS.AGENT_STATUS_CHANGED, event.state.status);
    });
  }

  registerCallEvents() {
    
    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_ANSWER_ACCEPT, () => {
      
      logger.debug(' peer.call.answer.accept ');
      this.toggleVideo(true);
      
      setTimeout(() => {
        
        this.draggableService.initialise('draggable');
//        new Draggable('draggable');
      }, 50);
      
    });

    this.eventAggregator.subscribe(MESSAGE_EVENTS.NOTIFICATION, () => {
      
      setTimeout(() => {
        this.toggleVideo(true);
        this.draggableService.initialise('draggable');
      }, 50);
      
    });
    
    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_DISCONNECTED, () => {
      
      logger.debug(' peer.call.disconnected ');
      this.toggleVideo(false);
      this.dispatcher.dispatch(HUD_ACTIONS.INCOMING_VIDEO_CALL_REJECTED);
    });
    
    logger.debug(' subscribing to peer.call.video.toggle');
    
    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_VIDEO_TOGGLE, val => {
      
      logger.debug(' toggle video ');
      this.toggleVideo(val);
    });
  }

  toggleVideo(val) {
    
    this.onVideo = val;
  }

  deregisterEvents() {
    this.dispatcher.dispatch(HUD_ACTIONS.AGENT_STATUS_CHANGED, []);
    if (!this.userSession.user) {
      return;
    }
    let userid = this.userSession.user.userId;
    this.hudDatabaseService.onPageClose(userid);
  }

  retrieveCurrentAgentStatus() {

    logger.debug('retrieveCurrentAgentStatus >> userSession > ', this.userSession);

    let userId = this.userSession.user.userId;
    this.applicationService.displayUserPassportCurrentStatus(userId)
      .then(
        result => {
          logger.debug('displayUserPassportCurrentStatus >>> result = ', result);
          let displayCurrentStatusView = result.displayCurrentStatusView[0];
          this.userSession.agent = displayCurrentStatusView.id; // TODO revise this - the agent use session is set here... this should happen on login
          this.dispatcher.dispatch(HUD_ACTIONS.AGENT_STATUS_RETRIEVED, displayCurrentStatusView.status);
        },
        error => {
          logger.debug(error);
        }
      )
    ;
  }
  
  incomingCall() {
    
    this.dispatcher.dispatch(HUD_ACTIONS.INCOMING_VIDEO_CALL);
  }
  
  callRejected() {
    
    this.dispatcher.dispatch(HUD_ACTIONS.INCOMING_VIDEO_CALL_REJECTED);
  }

  retrieveUserRole() {
    this.dispatcher.dispatch(HUD_ACTIONS.USER_ROLE_RETRIEVED, this.userSession.userRole);
  }

  changeSystemAgentStatus(status) {

    var userId = this.userSession.user.userId;

    let message = {
      feature: 'passport',
      name: 'com.zailab.user.user.api.commands.ChangeStatusCommand',
      state: {
        userId: userId,
        status: status
      }
    };
    
    this.webSocket.publish(message);
  }

  reportLogout() {
    var passportId = this.userSession.user.passportId;
    this.applicationService.logout(passportId);
  }

  navHome() {
      
    this.dispatcher.dispatch(HUD_ACTIONS.NAV_HOME, true);
  }
  
  disconnectVideoCall() {

    this.peerService.endCall();

    this.dispatcher.dispatch(HUD_ACTIONS.DISCONNECT_VIDEO_CALL);
  }

  @handle(LOGIN_ACTIONS.LOGIN_PASSED)
  handleLoginPassed(message) {
    
    logger.debug('handleLoginPassed');
    this.registerEvents();
  }
}
/*
*/
//var Draggable = function (id) {
//  
//  var el = document.getElementById(id),
//      
//  isDragReady = false,
//  dragoffset = {
//    x: 0,
//    y: 0
//  };
//
//  this.init = function () {
//    this.initPosition();
//    this.events();
//  };
//
//  this.initPosition = function () {
//    el.style.position = "fixed";
//    el.style.top = "auto";
//    el.style.bottom = "20px";
//    el.style.left = "20px";
//  };
//
//  this.events = function () {
//    var self = this;
//    _on(el, 'mousedown', function (e) {
//      isDragReady = true;
//      dragoffset.x = e.pageX - el.offsetLeft;
//      dragoffset.y = e.pageY - el.offsetTop;
//    });
//    _on(document, 'mouseup', function () {
//      isDragReady = false;
//    });
//    _on(document, 'mousemove', function (e) {
//      if (isDragReady) {
//        
//        var top = e.pageY - dragoffset.y;
//        var left = e.pageX - dragoffset.x;
//        var w = window.innerWidth;
//        var h = window.innerHeight;
//        
//        if (e.pageY < 1 || e.pageY > h || e.pageX < 1 || e.pageX > w) {
//          return;
//        }
//        
//        el.style.top = top + "px";
//        el.style.bottom = "auto";
//        el.style.left = left + "px";
//      }
//    });
//  };
//  var _on = function (el, event, fn) {
//    document.attachEvent ? el.attachEvent('on' + event, fn) : el.addEventListener(event, fn, !0);
//  };
//  this.init();
//}
