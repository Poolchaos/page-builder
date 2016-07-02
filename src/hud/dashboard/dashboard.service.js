/*
zailab
*/
import {HUD_ANIMATOR_EVENTS} from '../hud.animator.events';
import {DASHBOARD_ACTIONS} from './dashboard.actions';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
Logger
*/
const logger = LogManager.getLogger('DashboardService');
/*
Dashboard Service - dispatches the dashboard interface actions
*/
@inject(Dispatcher, EventAggregator)
export class DashboardService { // TODO - find a way to prevent the dashboard from activating if it has been deactived already - because the activateDashboard will be called for no reason

  attachedCallback = null;

  constructor(dispatcher, eventAggregator) {

    this.dispatcher = dispatcher;
    this.eventAggregator = eventAggregator;
  }

  onAttached(cb) {
    
    this.attachedCallback = cb;
  }

  attached() {

    if (this.attachedCallback) {

      this.attachedCallback();
      this.attachedCallback = null;
    }
  }

  deactivateDashboard() {

    this.dispatcher.dispatch(DASHBOARD_ACTIONS.DEACTIVATE_DASHBOARD);

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.DASHBOARD_DEACTIVATED);
  }

  activateDashboard(helmViewModel, portItems, starboardItems) {
    
    let config = {

      helmViewModel: helmViewModel,
      portItems: portItems,
      starboardItems: starboardItems
    };


    setTimeout(() => {
      this.dispatcher.dispatch(DASHBOARD_ACTIONS.ACTIVATE_DASHBOARD, config);
      this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.DASHBOARD_ACTIVATED);
    }, 200);
  }

  selectPortOption(option) {

    this.dispatcher.dispatch(DASHBOARD_ACTIONS.SELECT_PORT_OPTION, option);
  }

  selectStarboardOption(option) {

    this.dispatcher.dispatch(DASHBOARD_ACTIONS.SELECT_STARBOARD_OPTION, option);
  }
}
