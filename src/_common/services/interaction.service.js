/*
zailab
*/
import {WebSocketKiosk}        from './websocket.kiosk';
import {MESSAGE_EVENTS}        from './display.message.service.events';
/*
aurelia
*/
import {inject, LogManager}    from 'aurelia-framework';
import {Dispatcher}            from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
Logger
*/
const logger = LogManager.getLogger('InteractionService');

@inject(WebSocketKiosk, Dispatcher, EventAggregator)
export class InteractionService {


  constructor(webSocketKiosk, dispatcher, eventAggregator) {

    this.webSocketKiosk = webSocketKiosk;
    this.dispatcher = dispatcher;
    this.eventAggregator = eventAggregator;
  }

  subscribe() {

    this.webSocketKiosk.subscribe('IncomingInteraction', (data) => {

      logger.debug(' IncomingInteraction >>>> ', data);
      this.onIncomingInteraction(data);
    });

    this.webSocketKiosk.subscribe('ConnectInteraction', (data) => {
      logger.debug(' ConnectInteraction >>>> ', data);
      this.onConnectInteraction(data);
    });

//        setTimeout(() => {
//          this.onConnectInteraction({
//            src: '07623456789',
//            payload: {
//              text: 'cookies and cream?',
//              source: '07623456789'
//            }
//          });
//        }, 4000);
  }

  onIncomingInteraction(data) {

    logger.debug(' incoming sms received ', data);

    let src = data.src;
    let dst = data.dst;

    let envelope = {
      event: 'Interaction',
      data: {
        src: dst,
        dst: src,
        type: 'AcceptInteraction',
        payload: null
      }
    };

    this.webSocketKiosk.emitInteraction(envelope);
  }

  onConnectInteraction(data) {

    this.interaction = data;
    //    this.endInteraction(data);

    logger.debug(' SMS received >>> ', data);

    let fromNumber = data.payload.source;
    let text = data.payload.text;

    this.dispatcher.dispatch(MESSAGE_EVENTS.NOTIFICATION, {
      fromNumber: fromNumber,
      text: text
    });

    this.eventAggregator.publish(MESSAGE_EVENTS.NOTIFICATION);
  }

  startInteraction(message, toNumber, userId) {

    let envelope = {
      event: 'Interaction',
      data: {
        src: userId,
        dst: 'SMS',
        type: 'StartInteraction',
        payload: {
          source: userId,
          target: toNumber,
          text: message
        },
        callType: 'SMS'
      }
    };

    this.webSocketKiosk.emitInteraction(envelope);
  }

  endInteraction() {

    if (!this.interaction) {

      return;
    }

    let src = this.interaction.src;
    let dst = this.interaction.dst;

    let envelope = {
      event: 'Interaction',
      data: {
        src: dst,
        dst: src,
        type: 'EndInteraction',
        payload: null,
        callType: 'SMS'
      }
    };

    this.webSocketKiosk.emitInteraction(envelope);
  }
}