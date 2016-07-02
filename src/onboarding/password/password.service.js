/*
 */
import {Dispatcher} from 'aurelia-flux';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ApplicationService} from '../../_common/services/application.service';
import {PASSWORD_ACTIONS} from './password.actions';
/*
 */
import {WINDOW_EVENTS} from 'zailab.common';
/*
 */
@inject(ApplicationService, Dispatcher, EventAggregator)
export class PasswordService {

  capslockOnPasswordDetection;

  constructor(applicationService, dispatcher, eventAggregator) {

    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.eventAggregator = eventAggregator;

    this.registerEvents();
  }

  registerEvents() {

    this.applicationService.onPasswordReset(payload => this.dispatcher.dispatch(PASSWORD_ACTIONS.RESET_PASSWORD_COMPLETED));
  }

  requestPasswordReset(email) {

    this.dispatcher.dispatch(PASSWORD_ACTIONS.REQUEST_RESET_PASSWORD);

    this.applicationService.resetUserPasswordSearch(email)
      .then(
        response => {
          if (response.resetPasswordView && response.resetPasswordView.length > 0) {
            let passportId = response.resetPasswordView[0].passportId;
            this.applicationService.requestPasswordReset(email, passportId);
            this.dispatcher.dispatch(PASSWORD_ACTIONS.RESET_PASSWORD_REQUESTED, passportId);
          } else {

            this.dispatcher.dispatch(PASSWORD_ACTIONS.RESET_PASSWORD_FAILED);
          }
        },
        error => {

          this.dispatcher.dispatch(PASSWORD_ACTIONS.RESET_PASSWORD_FAILED);
        }
      )
    ;
  }

  submitPasswordReset(newPassword, passportId) {

    this.applicationService.resetPassword(newPassword, passportId);
  }

  enableCapslockOnPasswordDetection() {

    this.capslockOnPasswordDetection = this.eventAggregator.subscribe(WINDOW_EVENTS.ON_CAPSLOCK_DETECTED, (data) => { // TODO this gets called for every key event - not safe

        this.dispatcher.dispatch(PASSWORD_ACTIONS.CAPS_LOCK_ERROR, data.settings.message);
    });

    this.capslockOffPasswordDetection = this.eventAggregator.subscribe(WINDOW_EVENTS.OFF_CAPSLOCK_DETECTED, (data) => { // TODO this gets called for every key event - not safe
      
        this.dispatcher.dispatch(PASSWORD_ACTIONS.CLEAR_ERROR);
    });
  }

  disableCapslockOnPasswordDetection() {

    this.capslockOnPasswordDetection.dispose();
    this.capslockOffPasswordDetection.dispose();
  }
}
