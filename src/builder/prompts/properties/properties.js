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
  tabs = {
    size: true,
    background: false,
    border: false
  };
  borderStyle = 'none';
//, 'double', 'groove', 'ridge', 'inset', 'outset' =>  does nothing in chrome
  borderStyles = ['none', 'dotted', 'dashed', 'solid', 'hidden'];
  borderWidth = 1;
  borderColor = '0, 0, 0';
  backgroundColor = '255, 255, 255';
  
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
    
    // size tab
    this.width = parseInt(element.style.width.replace('px', ''));
    this.height = parseInt(element.style.height.replace('px', ''));
    
    // background tab
    this.backgroundColor = element.style.background ? element.style.background.substring(element.style.background.lastIndexOf('(') + 1, element.style.background.lastIndexOf(')')) : this.backgroundColor;
    
    // border tab
    this.borderWidth = element.style.borderWidth ? parseInt(element.style.borderWidth) : this.borderWidth;
    this.borderStyle = element.style.borderStyle ? element.style.borderStyle : this.borderStyle;
    this.borderColor = element.style.borderColor ? element.style.borderColor.substring(element.style.borderColor.lastIndexOf('(') + 1, element.style.borderColor.lastIndexOf(')')) : this.borderColor;
  }

  view(view) {
    
    for(let tab in this.tabs) {
      
      this.tabs[tab] = false;
    }
    
    this.tabs[view] = true;
  }

  selectBorderStyle(style) {
    
    this.showBorderStyles = false;
    this.borderStyle = style;
  }
  
  update() {
    
    this.dispatcher.dispatch('builder.component.style.change', {
      height: this.height + (this.heightClass === 'pixel' ? 'px' : '%'),
      width: this.width + (this.widthClass === 'pixel' ? 'px' : '%'),
      'border-width': this.borderWidth + 'px',
      'border-style': this.borderStyle,
      'border-color': 'rgb(' + this.borderColor + ')',
      background: 'rgb(' + this.backgroundColor + ')'
    });
    
    this.controller.ok();
  }
}