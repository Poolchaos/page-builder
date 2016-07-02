import {PeerService, PEER_SERVICE_EVENTS} from 'zailab.common';
/*
*/
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, LogManager}  from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
/*
*/
const logger = LogManager.getLogger('CallPrompt');
/*
*/
@inject(EventAggregator, PeerService, DialogController)
export class CallPrompt {
  
  constructor(eventAggregator, peerService, dialogController) {
    
    this.eventAggregator = eventAggregator;
    this.peerService = peerService;
    this.controller = dialogController;
    
    this.init();
  }
  
  init() {
    
    this.eventAggregator.subscribe('peer.call.disconnected', () => {
      
      if(this.controller) {
        this.controller.close();
      }
    });
  }
  
  acceptCall() {
    
    this.peerService.acceptCall(() => {
      
      logger.debug(' call answered ');
      
      if(this.controller) {
        this.controller.close();
      }
      
      this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_ANSWER_ACCEPT);
    });
  }
  
  rejectCall() {
    
    this.peerService.rejectCall(() => {
      
      logger.debug(' call rejected ');
      
      if(this.controller) {
        this.controller.close();
      }
      
      this.eventAggregator.publish(PEER_SERVICE_EVENTS.PEER_CALL_ANSWER_REJECT);
    });
  }
}