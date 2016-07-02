/*
zailab
*/
import {WebSocketKiosk}        from './websocket.kiosk';
import {UserSession}           from '../stores/user.session';
import {UrlFactory}            from '../factories/url.factory';
import {ApplicationProperties} from '../../_config/application.properties';
import {CameraService}         from './camera.service';
import {PEER_SERVICE_EVENTS}   from './peer.service.events';
/*
aurelia
*/
import {inject, LogManager}    from 'aurelia-framework';
import {EventAggregator}       from 'aurelia-event-aggregator';
/*
vendor
*/
import Peer from 'peerjs';
import uuid from 'node-uuid';
/*
Peer events
*/
const PEER_EVENTS = {
  OPENED: 'open',
  CALL_RECEIVED: 'incoming-call',
  CALL_ANSWERED: 'call-answered',
  CALL_DISCONNECTED: 'end-call'
};
/*
Logger
*/
const logger = LogManager.getLogger('PeerService');
/*
Peer Service - this service wraps the peer (web rtc) functionality and exposes only the behaviour that is needed by the web app
*/
@inject(WebSocketKiosk, UserSession, UrlFactory, ApplicationProperties, EventAggregator, CameraService)
export class PeerService {

  ready = false;
  peer = null;
  remotePeerId = null;
  remoteConnection = null;
  remoteStream = null;
  localStream = null;
  remoteStreamURL = null;
  hasNoStreamObserver = true;

  constructor(webSocketKiosk, userSession, urlFactory, applicationProperties, eventAggregator, cameraService) {

    this.webSocketKiosk = webSocketKiosk;
    this.userSession = userSession;
    this.urlFactory = urlFactory;
    this.applicationProperties = applicationProperties;
    this.eventAggregator = eventAggregator;
    this.cameraService = cameraService;
    
//    setTimeout(() => {
//      this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_RECEIVED, {});
//      this.eventAggregator.publish('hud.animator.incoming.call.received', {});
//    }, 4000);
  }

  registerPeer() {

    if (this.userSession.isCallsAllowed === false || (this.webSocketKiosk.ws && [0, 1].indexOf(this.webSocketKiosk.ws.readyState) !== -1)) {
      logger.info('REGISTER PEER SKIPPED BECAUSE USER ROLE DOES NOT ALLOW CALLS OR AN EXISTING WS WAS FOUND WITH CONNECTING/OPEN READYSTATE : this.socket = ', this.socket, ' this.webSocketKiosk = ', this.webSocketKiosk);
      return;
    } else {
      logger.info('REGISTER PEER BECAUSE USER ROLE DOES ALLOW CALLS AND NO EXISTING WS WAS FOUND OR EXISTING WS WAS FOUND WITHOUT CONNECTING/OPEN READYSTATE : this.socket.ws = ', this.webSocketKiosk.ws);
    }

    this.ready = false;

    this.userSession.retrieveUserId(userId => {

      var host = this.applicationProperties.apiInteractionEndpoint;
      this.webSocketKiosk.io.uri = this.urlFactory.buildSearchUrl(host, `id=${userId}&token=token`);

      this.webSocketKiosk.subscribe('END-CALL', (data) => {

        logger.debug('END-CALL with data = ', data);

        this.disconnectCall();
      });

      this.webSocketKiosk.connect(() => {

        logger.debug(' webSocketKiosk.connect > this.webSocketKiosk.ws >>> ', this.webSocketKiosk.ws);
        
        this.peer = new Peer(userId, {
          debug: 3,
          websocket: this.webSocketKiosk.ws,
          token: uuid.v4()
        });

        this.peer.on(PEER_EVENTS.OPENED, (peer) => {

          this.ready = true;

          logger.debug('peerOpened with peer = ', peer);

          this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_REGISTERED);
        });
        

        this.peer.on(PEER_EVENTS.CALL_RECEIVED, (remotePeerId, connection) => {

          logger.debug('callReceived with remotePeerId = ', remotePeerId,', and connection = ', connection);

          this.remotePeerId = remotePeerId;
          this.remoteConnection = connection;

          this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_RECEIVED);
        });

        this.peer.on(PEER_EVENTS.CALL_ANSWERED, (connection) => {

          logger.debug('callAnswered with connection = ', connection);

          this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_ANSWERED, {connection: connection});
        });

        this.peer.on(PEER_EVENTS.CALL_DISCONNECTED, () => {

          logger.debug('callDisconnected');

          this.disconnectCall();
        });
      });
    });
  }

  acceptCall(callback) {

    try {

      this.cameraService.getMediaStream((error, stream) => {
        
        logger.debug(' local stream >>> ', stream);

        if (error) {

          logger.error('cameraService.getMediaStream returning because it failed with error = ', error);

          callback(error);
          return;
        }

        this.localStream = stream;

        logger.debug('acceptCall > cameraService.getMediaStream with localStream = ', this.localStream, ' and remoteConnection = ', this.remoteConnection);

        if (this.remoteConnection) {

          logger.debug('acceptCall > cameraService.getMediaStream has remoteConnection and will call answer on it using localStream = ', this.localStream, ' and then RETURN!');

          this.remoteConnection.on('stream', (remoteStream) => {

            logger.debug('remoteConnection on stream with remoteStream = ', remoteStream);

            this.remoteStream = remoteStream;
            this.remoteStreamURL = URL.createObjectURL(remoteStream);

            callback(null);
          });

          this.remoteConnection.answer(this.localStream);
          return;
        }

        logger.debug('acceptCall > cameraService.getMediaStream has NO remoteConnection and will call acceptCall on this.peer using remotePeerId = ', this.remotePeerId, ' and localStream = ', this.localStream, ' and then RETURN!');

        let result = this.peer.acceptCall(this.remotePeerId, this.localStream);
        
        logger.debug(' result >>> ', result);

        result.call.on('stream', (remoteStream) => {
          
          logger.debug(' MEDIACONNECTION stream received >>> ', remoteStream);
          logger.debug(' this.peer >>> ', this.peer);

          this.remoteStream = remoteStream;
          this.remoteStreamURL = URL.createObjectURL(remoteStream);

          callback(null);
        });
      });
    } catch (exception) {

      callback(exception);
    }
  }

  rejectCall(callback) {
    this.peer.rejectCall(this.remotePeerId);
    callback();
  }

  disconnectCall() {

    logger.debug('disconnectCall');

    stopTracks(this.localStream);
    stopTracks(this.remoteStream);

    setTimeout(() => {

      this.remoteConnection = null;
      this.localStream = null;
      this.remoteStream = null;
      this.remoteStreamURL = null;
    });

    this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_DISCONNECTED);
  }

  endCall() {

    logger.debug('endCall');

    this.peer.disconnectFromCall(this.remotePeerId, this.remoteConnection);

    this.disconnectCall();
  }
}

function stopTracks(stream) {

  if (!stream) {

    return;
  }

  let tracks = stream.getTracks();

  logger.debug('stopTracks > stream = ', stream, ', tracks = ', tracks);

  for (let track of tracks) {

    logger.debug('stopTracks > track = ', track);

    track.stop();
    track.enabled = false;
  }
}
