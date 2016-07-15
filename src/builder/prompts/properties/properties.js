import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {LoggerManager, BuilderStore} from 'zailab.common';
/*
*/
let logger;
/*
*/
@inject(DialogController, LoggerManager, Dispatcher, BuilderStore)
export class Properties {
  
  widthClass = 'pixel';
  heightClass = 'pixel';
  
  constructor(dialogController, loggerManager, dispatcher, builderStore) {
    
    logger = loggerManager.createInstance('Properties');
    
    this.controller = dialogController;
    this.dispatcher = dispatcher;
    this.builderStore = builderStore;
    
    this.init();
  }
  
  init() {
    
    let element = document.getElementById(this.builderStore.itemContextMenu);
    
    this.widthClass = element.style.width.indexOf('%') !== -1 ? 'percentage' : 'pixel';
    this.heightClass = element.style.height.indexOf('%') !== -1 ? 'percentage' : 'pixel';
    
    this.width = parseInt(element.style.width.replace('px', ''));
    this.height = parseInt(element.style.height.replace('px', ''));
  }
  
  update() {
    
    this.dispatcher.dispatch('builder.component.style.change', {
      height: this.height + (this.heightClass === 'pixel' ? 'px' : '%'),
      width: this.width + (this.widthClass === 'pixel' ? 'px' : '%')
    });
    
    this.controller.ok();
  }
}