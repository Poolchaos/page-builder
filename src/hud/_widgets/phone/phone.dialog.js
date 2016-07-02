import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {EventAggregator}     from 'aurelia-event-aggregator';
import {PEER_SERVICE_EVENTS}   from '../../../_common/services/peer.service.events';
import {HUD_ANIMATOR_EVENTS} from '../../hud.animator.events';

@inject(DialogController, EventAggregator)
export class PhoneDialog {
  
  peerCallDisconnectedSubscription;

  constructor(dialogController, eventAggregator) {

    this.controller = dialogController;
    this.eventAggregator = eventAggregator;
  }
  
  activate() {
    
    this.peerCallDisconnectedSubscription = this.eventAggregator.subscribe(PEER_SERVICE_EVENTS.PEER_CALL_DISCONNECTED, () => {
      this.controller.cancel();
      this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
    });
  }
  
  deactivate() {
    
    this.peerCallDisconnectedSubscription.dispose();
  }
}
