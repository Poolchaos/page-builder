/*
zailab
*/
import {HUD_ANIMATOR_ACTIONS} from './hud.animator.actions';
import {HUD_ANIMATOR_EVENTS} from './hud.animator.events';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Dispatcher} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('HeadsUpDisplayAnimator');
/*
Heads Up Display Animator - listenens for events that must execute animations
*/
@inject(EventAggregator, Dispatcher)
export class HeadsUpDisplayAnimator {

  startTime;

  constructor(eventAggregator, dispatcher) {

    this.dispatcher = dispatcher;

    this.registerEvents(eventAggregator);
  }

  registerEvents(eventAggregator) {

    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.SHOW_LOADER, payload => this.showLoader(payload));

    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.HIDE_WINGS_ROUTE_NAVIGATED, () => {this.pinWings(false);  this.hideWings();});
    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.SHOW_WINGS_ROUTE_NAVIGATED, () => {this.pinWings(true);   this.showWings();});

    eventAggregator.subscribe('router:navigation:processing', (data) => {

      logger.debug('router:navigation:processing > data = ', data);

      this.showLoader(true);
    });
    eventAggregator.subscribe('router:navigation:complete', (data) => {

      logger.debug('router:navigation:complete > data = ', data);

      setTimeout(() => this.showLoader(false), 500);
    });

    eventAggregator.subscribe('router:navigation:error', (data) => logger.debug('router:navigation:error > data = ', data));
    eventAggregator.subscribe('router:navigation:canceled', (data) => logger.debug('router:navigation:canceled > data = ', data));
    eventAggregator.subscribe('router:navigation:success', (data) => logger.debug('router:navigation:success > data = ', data));

    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.PROMPT_OPENED, () => this.blurBackground());
    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.PROMPT_CLOSED, () => this.focusBackground());

    //    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.DASHBOARD_ACTIVATED, () => this.focusBackground());
    //    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.DASHBOARD_DEACTIVATED, () => this.blurBackground());

    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.OPEN_POPUP, () => this.blurBackground());
    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.CLOSE_POPUP, () => this.focusBackground());
    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.INCOMING_CALL_ACCEPTED, () => this.slideLeftWingOut());

    this.dispatcher.dispatch(HUD_ANIMATOR_ACTIONS.ACTIVATE);
  }

  /*
  Heads Up Display Event Handlers/Animation Executors
  */

  showLoader(isVisible) {

    //logger.debug('showLoader >', isVisible);

    this.dispatcher.dispatch(HUD_ANIMATOR_EVENTS.SHOW_LOADER, isVisible);
  }

  blurBackground() {

    // TODO blur the background here
    this.dispatcher.dispatch(HUD_ANIMATOR_EVENTS.SHOW_BLUR);
  }

  focusBackground() {

    // TODO focus (disable blur) the background here
    this.dispatcher.dispatch(HUD_ANIMATOR_EVENTS.HIDE_BLUR);
  }

  slideLeftWingOut() {

    // TODO start wing opening animation
  }

  showWings() {
    this.dispatcher.dispatch(HUD_ANIMATOR_EVENTS.SHOW_WINGS);
  }

  hideWings() {
    this.dispatcher.dispatch(HUD_ANIMATOR_EVENTS.HIDE_WINGS);
  }

  pinWings(isPinned) {
    this.dispatcher.dispatch(HUD_ANIMATOR_EVENTS.PIN_WINGS, isPinned);
  }
}
