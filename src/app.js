/*
*/
import 'bootstrap';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {MESSAGE_EVENTS} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('App');
/*
*/
@inject(EventAggregator)
export class App {

  constructor(eventAggregator) {

    this.eventAggregator = eventAggregator;
  }

  activate() {

    
  }

  
  configureRouter(config, router) {

    config.title = 'Page builder';
    config.options.pushState = true;
    config.map([
      {route: ['', 'menu'],  name: 'menu',    moduleId: 'menu/menu',    nav: false, title: 'Menu',         auth: false},
      {route: 'builder',     name: 'builder', moduleId: 'builder/builder', nav: false, title: 'Page Builder', auth: true}
    ]);

    this.router = router;
  }
}
