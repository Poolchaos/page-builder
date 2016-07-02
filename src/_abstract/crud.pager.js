/*
*/
import {inject, bindable, ObserverLocator, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('CrudPager');
/*
*/
@inject(ObserverLocator)
export class CrudPager {

  @bindable items;
  @bindable display;
  @bindable settings;
  @bindable pagesize;

  currentPage;
  pages;

  constructor(observerLocator) {
    this.observerLocator = observerLocator;
  }

  bind() {

    this.initPages();
    this.initCrud();

    //    setTimeout(() => this.initCrud(), 500);
  }

  initCrud() {

    // logger.debug('initCrud > this.items = ', this.items);

    var subscription = this.observerLocator
      .getObserver(this, 'items')
      .subscribe((newValue, oldValue) => {

       // logger.debug('bind > getObserver > this.items = ', this.items);

        this.initPages();
      });

    var subscription = this.observerLocator
      .getArrayObserver(this.items)
      .subscribe((slices) => {

       // logger.debug('bind > getArrayObserver > this.items = ', this.items);

        this.initPages();
      });
  }

  initPages() {

    this.currentPage = 0;
    this.pages = [];

    if (!this.items) {
      this.pages.push([]);
      return;
    }

    let pageItems = null;

    for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {

      if (itemIndex % this.pagesize === 0) {

        if (pageItems !== null) {
          this.pages.push(pageItems);
        }
        pageItems = [];
      }

      pageItems.push(this.items[itemIndex]);
    }

    if (pageItems !== null && pageItems.length > 0) {
      this.pages.push(pageItems);
    }
  }

  get pagedItems() {

    return this.pages[this.currentPage];
  }

  next() {

    this.currentPage++;
  }

  prev() {

    this.currentPage--;
  }

  get showNext() {

    if (this.pages)
      return this.currentPage < this.pages.length - 1;
  }

  get showPrev() {

    return this.currentPage > 0;
  }

  getFirstDataLabel(item) {

    return this.getDataLabels(item)[0];
  }

  getDataLabels(item) {

    let dataLabels = item[this.display];

    let result = dataLabels instanceof Array ? dataLabels : [dataLabels];

    return result;
  }
  getInformationLabels(item,number) {
    let dataLabels = item[this.display];

    let result = dataLabels instanceof Array ? dataLabels : [dataLabels];
    if (result[number]) {
      return result[number];
    } else {
      return ' ';
    }
   }

  getDisplayClass(item) {

    if (item.isSelected) {
      item._displayClass = 'is-selected';
      return;
    }

    if (item.isMarked) {
      item._displayClass = 'is-marked';
      return;
    }

    item._displayClass = '';
  }
   
  getDisabledState(item) {
    if (item.isSelected) {
      return 'is-disabled';
    }
    if (item.isDisabled) {
      return 'o-crud-list__gem--non-selectable';
    }
    return '';

  }
   
  createClass(item){
    return item.pictureId ? 'o-crud-list__gem--profile-picture' : '';
  }
}
