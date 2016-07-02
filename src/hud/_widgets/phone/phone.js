/*
zailab
*/
import {PhoneService}        from './phone.service';
import {PhoneDialog}         from './phone.dialog';
import {HUD_ANIMATOR_EVENTS} from '../../hud.animator.events';
/*
aurelia
*/
import {inject, LogManager}  from 'aurelia-framework';
import {DialogService}       from 'aurelia-dialog';
import {EventAggregator}     from 'aurelia-event-aggregator';
import {Router}              from 'aurelia-router';
/*
Logger
*/
const logger = LogManager.getLogger('AgentPhone');
/*
Agent Phone Widget - show a dialog on incoming call
*/
@inject(PhoneService, DialogService, EventAggregator, Router)
export class AgentPhone {

  constructor(phoneService, dialogService, eventAggregator, router) {

    this.phoneService = phoneService;
    this.dialogService = dialogService;
    this.eventAggregator = eventAggregator;
    this.router = router;
  }

  activate() {

    this.phoneService.onCallReceived(() => this.showIncomingCall());
    this.phoneService.onCallDisconnected(() => {
      logger.debug('onCallDisconnected > this.router = ', this.router);
      this.router.navigate('wrapup');
    });
    
  }

  showIncomingCall() {

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.INCOMING_CALL_RECEIVED);

    this.dialogService.open({viewModel: PhoneDialog})
      .then(response => {

        if (response.wasCancelled) {

          this.phoneService.rejectIncomingCall();
        } else {

          this.phoneService.acceptIncomingCall().then(() => {

            this.router.navigate('videocall');
          });
        }

        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      })
    ;
    
    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }
}
