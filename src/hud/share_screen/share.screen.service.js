import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebSocketKiosk} from '../../_common/services/websocket.kiosk';
import {UserSession} from '../../_common/stores/user.session';
import {Dispatcher} from 'aurelia-flux';
import {SHARE_SCREEN_ACTIONS} from './share.screen.actions';
import {PeerService} from '../../_common/services/peer.service';

import uuid from 'node-uuid';
import Peer from 'peerjs';

const logger = LogManager.getLogger('ShareScreenService');

@inject(EventAggregator, WebSocketKiosk, UserSession, Dispatcher, PeerService)
export class ShareScreenService {

  streams = {};
  peerId = null;
  remotePeerId = null;
  screen = null;
  peer = null;
  connection = null;

  constructor(eventAggregator, socket, userSession, dispatcher, peerService) {

    this.eventAggregator = eventAggregator;
    this.socket = socket;
    this.userSession = userSession;
    this.dispatcher = dispatcher;

    this.userSession.retrieveUsername(username => this.peerId = username + '_screenShare');
    this.remotePeerId = peerService.remotePeerId;
    this.peer = peerService.peer;
  }

  startScreenShare() {

//    this.peer = new Peer(this.peerId, {
//      debug: 3,
//      websocket: this.socket.ws,
//      token: uuid.v4()
//    });

    this.screen = new Screen(uuid.v4(), (error) => {
      
      console.error('screen share eeror detected >> routing to phone view > ', error.name);
      this.dispatcher.dispatch(SHARE_SCREEN_ACTIONS.STOP_SCREEN_SHARE);
      
    });
    
    this.screen.onaddstream = (media) => {

      logger.debug(' screen share stream received >> ', media);

      this.streams.local = media.stream;

      this.connection = this.peer.call(this.remotePeerId, media.stream);

//      this.peer.on('incoming-call', (remotePeerId, connection) => { // nothing
//
//        logger.debug('TODO REMOVE : peer on incoming-call with remotePeerId = ', remotePeerId, ' and connection = ', connection);
//      });
//
//      this.peer.on('call-answered', (connection) => { // nothing
//
//        logger.debug('TODO REMOVE : peer on call-answered with connection = ', connection);
//      }); 

      this.peer.on('end-call', () => { // end

        logger.debug('peer on end-call');

        this.stopScreenShare(true);
      });

      this.connection.on('stream', (stream, connection) => { // connect

        logger.debug('connection on stream ', {stream: stream, connection: connection});

        this.streams.remote = stream;
      });
    };

    this.screen.share();
  }

  stopScreenShare(remoteCallDisconnected) {

    logger.debug('handle stop screen share');

    if (this.screen) {

      this.screen.check();
      this.screen.leave();
      
      logger.debug(' disconnecting screenshare call ');
      this.peer.disconnectFromCall(this.remotePeerId, this.connection);

      setTimeout(() => {

        for (var stream in this.streams) {

          if (!this.streams[stream]) {
            continue;
          }

          for (var i in this.streams[stream].getTracks()) {
            this.streams[stream].getTracks()[i].stop();
            this.streams[stream].getTracks()[i].enabled = false;
          }
        }

        setTimeout(() => {

          this.streams = {};

          this.dispatcher.dispatch(SHARE_SCREEN_ACTIONS.STOP_SCREEN_SHARE, remoteCallDisconnected);
        }, 300);
      }, 300);
    }
  }
}
