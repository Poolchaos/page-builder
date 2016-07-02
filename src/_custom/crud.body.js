/*
*/
import {Crud} from 'zailab.framework';
/*
*/
import {inject, customElement, bindable, BindingEngine, LogManager, ObserverLocator} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('CrudBody');
/*
*/
@customElement('crud-body')
@inject(BindingEngine, EventAggregator, ObserverLocator)
export class CrudBody extends Crud {

  @bindable items;
  @bindable settings;
  @bindable display;
  @bindable options;

  subscription = null;

  constructor(bindingEngine, eventAggregator, observerLocator) {

    super();

    this.bindingEngine = bindingEngine;
    this.eventAggregator = eventAggregator;
    this.observerLocator = observerLocator;
  }

  bind() {

    this.setItems(this.items);
    this.setSettings(this.settings);
    this.initCrud();
  }

  attached() {

    setTimeout(() => {
      
      this.ready = true;
    }, 500);
  }

  initCrud() {

    this.eventAggregator.publish('crud.items.changed', this.items);
    this.subscribeCollectionObserver();
  }

  subscribeCollectionObserver() {

    //    let foo = 0;

    sortItemsBy(this.items, this.display);

    if (this.subscription === null) {

      this.subscription = this.bindingEngine
        .collectionObserver(this.items)
        .subscribe((slices) => {

          //          if (foo === 5) {
          //
          //            logger.debug('subscribeCollectionObserver > foo');
          //            return;
          //          }

          if (oneAdded(slices) === false && oneChanged(slices) === false) {

            // logger.debug('subscribeCollectionObserver > returning > slices = ', slices);
            return;
          }

          //          foo++;

          // logger.debug('subscribeCollectionObserver > this.items = ', this.items);
          // logger.debug('subscribeCollectionObserver > slices = ', slices);

          sortItemsBy(this.items, this.display);

          this.eventAggregator.publish('crud.items.changed', this.items);

          this.setItems(this.items);
        }
      );
      
      var subscription = this.observerLocator
      .getObserver(this, 'items')
      .subscribe((newValue, oldValue) => {

        this.eventAggregator.publish('crud.items.changed', this.items);

        this.setItems(this.items);
      });
    }
  }

  add() {

    if (this.options && this.options.add) {
      this.options.add();
      return;
    }

    logger.warn('add > unimplemented');
  }

  change(item) {

    if (this.options && this.options.change) {
      this.options.change(item);
      return;
    }

    logger.warn('change > unimplemented');
  }

  remove(item) {

    if (this.options && this.options.remove) {
      this.options.remove(item);
      return;
    }

    logger.warn('remove > unimplemented');
  }

  compare(item, searchText) {

    if (this.options && this.options.compare) {
      return this.options.compare(item, searchText);
    }

    //    if (item[this.display] instanceof Array) {
    //
    //      for (let text of item[this.display]) {
    //
    //        let compareText = text + '';
    //
    //        if (compareText.toLowerCase().startsWith(searchText.toLowerCase())) {
    //          return true;
    //        }
    //      }
    //
    //      return false;
    //    }
    //
    //    let matches = item[this.display].toLowerCase().startsWith(searchText.toLowerCase());

    let itemValue = item[this.display] instanceof Array ? item[this.display][0] : item[this.display];

    let matches = itemValue.toLowerCase().startsWith(searchText.toLowerCase());

    return matches;
  }
}
/*
*/
function sortItemsBy(items, display) {

  // logger.debug('sortItemsBy > items = ', items);
  // logger.debug('sortItemsBy > display = ', display);

  if (!items || items.length === 0) {
    return;
  }

  items.sort((item1, item2) => {

    let item1Values = item1[display] instanceof Array ? item1[display] : [item1[display]];
    let item2Values = item2[display] instanceof Array ? item2[display] : [item2[display]];

    let length = item1Values.length;

    let compare = 0;

    for (let i = 0; i < length; i++) {

      compare = compareItems(item1Values[i], item2Values[i]);

      if (compare === 0) {
        continue;
      }

      break;
    }

    return compare;
  });
}
/*
*/
function compareItems(value1, value2) {

  //  logger.debug('compareItems > value1 = ', value1);
  //  logger.debug('compareItems > value2 = ', value2);

  if (format(value1) < format(value2)) {
    return -1;
  }

  if (format(value1) > format(value2)) {
    return 1;
  }

  return 0;
}
/*
*/
function format(value) {

  let slices = value.split(' ');

  let buffer = '';
  for (let slice of slices) {
    buffer += slice;
  }
  return buffer.toLowerCase();
}
/*
*/
function oneAdded(slices) {

  return slices.length === 1 && slices[0].addedCount === 1;
}
/*
*/
function oneChanged(slices) {

  return slices.length === 2 && slices[0].removed.length === 1 && slices[1].addedCount === 1;
}
