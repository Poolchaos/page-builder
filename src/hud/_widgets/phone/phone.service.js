/*
zailab
*/
import {HUD_ACTIONS}         from '../../hud.actions';
import {PHONE_ACTIONS}       from './phone.actions';
import {PeerService}         from '../../../_common/services/peer.service';
import {PEER_SERVICE_EVENTS} from '../../../_common/services/peer.service.events';
/*
aurelia
*/
import {inject}              from 'aurelia-framework';
import {Dispatcher}          from 'aurelia-flux';
import {EventAggregator}     from 'aurelia-event-aggregator';
/*
vendor
*/
import Peer                  from 'peerjs';
import uuid                  from 'node-uuid';
/*
Phone Service - this service is for the agent phone widget
*/
@inject(Dispatcher, PeerService, EventAggregator)
export class PhoneService {

  onCallReceivedCallback;
  onCallDisconnectedCallback;

  constructor(dispatcher, peerService, eventAggregator) {

    this.dispatcher = dispatcher;
    this.peerService = peerService;
    this.eventAggregator = eventAggregator;

    this.init();
  }

  init() {

    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_RECEIVED, () => this.onCallReceivedCallback && this.onCallReceivedCallback());

    this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_DISCONNECTED, () => this.onCallDisconnectedCallback && this.onCallDisconnectedCallback());

    this.peerService.registerPeer();
  }

  onCallReceived(onCallReceivedCallback) {

    this.onCallReceivedCallback = onCallReceivedCallback;
  }

  onCallDisconnected(onCallDisconnectedCallback) {

    this.onCallDisconnectedCallback = onCallDisconnectedCallback;
  }

  acceptIncomingCall() {

    return new Promise((resolve) => {

      this.peerService.acceptCall((error) => {

        if (error) {

          logger.error('peerService.acceptCall failed with error = ', error);
        }else {

          this.dispatcher.dispatch(HUD_ACTIONS.ACCEPT_VIDEO_CALL);
          
          resolve();
        }
      });
    });
  }

  rejectIncomingCall() {

    this.peerService.rejectCall();
  }
}
