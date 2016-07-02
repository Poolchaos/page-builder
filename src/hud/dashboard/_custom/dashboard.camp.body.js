/*
*/
import {Crud, PROMPT_ACTIONS} from 'zailab.framework';
/*
*/
import {inject, customElement, bindable, LogManager, ObserverLocator} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {handle} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('DashboardCampBody');
/*
*/
let SETTINGS = {
  add: {enabled: false},
  delete: {enabled: true},
  select: {enabled: false},
  edit: {enabled: true}
};
/*
*/
@customElement('dashboard-camp-body')
@inject(ObserverLocator, EventAggregator)
export class DashboardCampBody extends Crud {

  @bindable items;
  @bindable display;
  @bindable settings;

  showCamp = true;
  
  constructor(observerLocator, eventAggregator) {

    super(null);
    this.observerLocator = observerLocator;
    this.eventAggregator = eventAggregator;
  }

  bind() {
    
    logger.debug('bind > this.settings = ', this.settings);
    logger.debug('bind > this.items = ', this.items);
    
    var subscription = this.observerLocator
      .getObserver(this, 'items')
      .subscribe((newValue, oldValue) => {

        logger.debug('1 init > getObserver > this.items = ', this.items);
        
        this.eventAggregator.publish('crud.items.changed', this.items);

        this.setItems(this.items);
      });
    
    this.setSettings(this.settings || SETTINGS);
    this.setItems(this.items);
  }

  get isShowCamp() {

    this.hasItems = this.items && isSelectedItems(this.items);
    
    let result = (this.showCamp && this.hasItems) || this.searchText;

    return result;
  }
   
  get pageSize() {
    
    return 3;
  }

  @handle(PROMPT_ACTIONS.OPEN_PROMPT)
  handleOpenPrompt(action, option) {

    this.showCamp = false;
    
    this.deleting = false;
    this.searchText = '';
    this.search();
  }

  @handle(PROMPT_ACTIONS.CLOSE_PROMPT)
  handleClosePrompt(action, option) {

    this.showCamp = true;
    
    this.tryFocus(55);
  }
}
/*
*/
function isSelectedItems(items) {

  for (let item of items) {

    if (item.isSelected) {
      return true;
    }
  }

  return false;
}
