import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

const logger = LogManager.getLogger('WebSocketKiosk');

@inject(EventAggregator)
export class WebSocketKiosk {

  io = {};
  wsState = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED'
  };
  subscribers = [];

  constructor(eventAggregator) {

    this.io.uri = ''; // mimic socket.io
    this.eventAggregator = eventAggregator;

//    this.logWebSocketState();
    this.eventAggregator.subscribe('logout', view => this.close());
  }

  logWebSocketState() {

    if (this.ws) {

      this.log(`${this.wsState[this.ws.readyState]} - this.ws = `, this.ws);
    } else {

      this.log('UNDEFINED - this.ws = ', this.ws);
    }

    setTimeout(() => {
      this.logWebSocketState();
    }, 10000);
  }

  log(note, obj) {

    logger.info(`[${new Date()}] ${note}`, obj);
  }

  connect(callback) {

    this.ws = new WebSocket(this.io.uri);

    this.ws.onopen = env => {
      logger.debug('opened');
      callback();
    };

    this.ws.onclose = env => {
      logger.debug('closed');
      this.callback = null;
    };

    this.ws.onmessage = env => {

      logger.debug('incoming env = ' + JSON.stringify(env));

      // deserialise messsage
      let data = JSON.parse(env.data);
      logger.debug('incoming message data = ', data);
      
      if(data.event === 'PING') {
        this.pingEndpoint(data);
        return;
      }

      let type = data.type ? data.type : (data.name ? data.name : data.event);
      if (!type) {
        return;
      }

      var subscriber = this.subscribers[type];
      if (subscriber && subscriber.callback) {

//        logger.debug('callback ', data);
        subscriber.callback(data);
        return;
      }else {

        logger.debug('no subscriber found for type = ', type);
      }
    };

    this.ws.direct = this.direct;
  }

  close() {
    if (this.ws) {
      logger.debug('closing websocket connection');
      this.ws.close();
      this.callback = null;
    }
  }

  emit(topic, env) {

    // convert and serialise messsage
    this.ws.send(JSON.stringify({
      authorization: env.Authorization,
      root: env.feature,
      type: env.name,
      payload: env.state,
      requestId: env.trackingId,
    }));
  }

  emitInteraction(env) {

    // convert and serialise messsage
    this.ws.send(JSON.stringify(env));
  }

  on(topic, callback) {

    this.callback = callback;
  }

  direct(envelope) { // TODO maybe move this to the peer service

    var message = JSON.stringify({
      event: 'DIRECT',
      data: envelope
    });

//    logger.debug('emitting DIRECT message = ' + JSON.stringify(message));

    this.ws.send(message);
  }

  subscribe(type, callback) {

    this.subscribers[type] = {callback: callback};
  }

  pingEndpoint = (env) => {
	  
    env.data.type = 'PONG';
    env.data.src = env.data.dst;
    this.ws.send(JSON.stringify(env));
	
  }
}
