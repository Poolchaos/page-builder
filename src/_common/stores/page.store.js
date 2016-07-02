/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('PageStore');

let STATE = {
  toolbar: [{
    display: 'layouts',
    items: [{
      text: '1'
    }, {
      text: '2'
    }]
  }, {
    display: 'themes',
    items: [{
      text: 'theme 1'
    }, {
      text: 'theme 2'
    }]
  }, {
    display: 'components',
    active: true,
    items: [{
      _id: 'comp1',
      text: 'textfield'
    }]
  }]
};

export class PageStore {
  
  get toolbar() {
    
    return STATE.toolbar;
  }
}