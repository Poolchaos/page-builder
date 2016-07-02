import {inject, computedFrom, LogManager} from 'aurelia-framework';
import {WebSocketClient} from './websocket.client';
import {WebSocketKiosk} from './websocket.kiosk';
import uuid from 'node-uuid';
import {UserSession} from '../../_common/stores/user.session';
import {ApplicationProperties} from '../../_config/application.properties';

const logger = LogManager.getLogger('WebSocket');

@inject(WebSocketClient, ApplicationProperties, UserSession, WebSocketKiosk)
export class WebSocket {

  constructor(socket, applicationProperties, userSession, webSocketKiosk) {

    this.applicationProperties = applicationProperties;
    this.userSession = userSession;
    this.socket = socket;
    this.socketKiosk = webSocketKiosk;
    this.subscribers = {};
    this.queue = [];
    this.open = false;

    this.init();
  }

  init() {

    this.socket.io.uri = this.applicationProperties.apiCommandEndpoint;

    this.socket.connect();

    this.subscribe({name: 'OPEN', callback: () => { this.onOpen(); }});

    this.socket.on('message-SUB', (emittedMessage) => {

            if (emittedMessage.name && emittedMessage.state) {
              logger.debug('incoming ', emittedMessage, ' on message-SUB');
            }

      var subscriber = this.subscribers[emittedMessage.name];
      if (subscriber && subscriber.callback) {
        //        logger.debug('emitting ', emittedMessage, ' on message-SUB');
        subscriber.callback(emittedMessage);
        return;
      }

      if (!emittedMessage.name && !emittedMessage.state) {
        //        logger.debug('ignoring ping');
        return;
      }

      //      logger.debug('ignoring ', emittedMessage, ' on message-SUB');
    });
  }

  onOpen() {

    logger.debug(' OPEN ');
    this.open = true;

    this.publish({name: 'OPENED'});

    // send queued messages
    for (let message of this.queue) {

      this.publish(message);
    }
  }

  publish(message) {

    if (this.open) {

      message.trackingId = uuid.v4();
      message.Authorization = this.userSession.authorization;

      logger.debug('outgoing message = ', message);

      this.socket.emit('message-PUB', message);
    } else {

      // queue message
      this.queue.push(message);
    }
  }

  subscribe(params) {

    this.subscribers[params.name] = {
      callback: params.callback
    };
  }
}
