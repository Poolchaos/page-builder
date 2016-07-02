/*
*/
import {inject, customElement, bindable, LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('CrudHeader');
/*
*/
@customElement('crud-header')
@inject(EventAggregator)
export class CrudHeader {
  
  @bindable itemcount;
}