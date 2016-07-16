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
  
  paddingTop = 0;
  paddingRight = 0;
  paddingBottom = 0;
  paddingLeft = 0;
  marginTop = 0;
  marginRight = 0;
  marginBottom = 0;
  marginLeft = 0;
  margin = 0;
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
    
        // set padding
    let splitPadding = element.style.padding ? element.style.padding.split(' ') : null;
    this.paddingTop = splitPadding && splitPadding[0] ? parseInt(splitPadding[0].replace('px', '')) : this.paddingTop;
    this.paddingRight = splitPadding && splitPadding[1] ? parseInt(splitPadding[1].replace('px', '')) : (splitPadding && splitPadding[0] ? this.paddingTop : this.paddingRight);
    this.paddingBottom = splitPadding && splitPadding[2] ? parseInt(splitPadding[2].replace('px', '')) : (splitPadding && splitPadding[0] ? this.paddingTop : this.paddingBottom);
    this.paddingLeft = splitPadding && splitPadding[3] ? parseInt(splitPadding[3].replace('px', '')) : (splitPadding && splitPadding[1] ? this.paddingRight : (splitPadding && splitPadding[0] ? this.paddingTop : this.paddingLeft));
    
        // set margin
    let splitMargin = element.style.margin ? element.style.margin.split(' ') : null;
    this.marginTop = splitMargin && splitMargin[0] ? parseInt(splitMargin[0].replace('px', '')) : this.marginTop;
    this.marginRight = splitMargin && splitMargin[1] ? parseInt(splitMargin[1].replace('px', '')) : (splitMargin && splitMargin[0] ? this.marginTop : this.marginRight);
    this.marginBottom = splitMargin && splitMargin[2] ? parseInt(splitMargin[2].replace('px', '')) : (splitMargin && splitMargin[0] ? this.marginTop : this.marginBottom);
    this.marginLeft = splitMargin && splitMargin[3] ? parseInt(splitMargin[3].replace('px', '')) : (splitMargin && splitMargin[1] ? this.marginRight : (splitMargin && splitMargin[0] ? this.marginTop : this.marginLeft));
    
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
      padding: this.paddingTop + 'px ' + this.paddingRight + 'px ' + this.paddingBottom + 'px ' + this.paddingLeft + 'px',
      margin: this.marginTop + 'px ' + this.marginRight + 'px ' + this.marginBottom + 'px ' + this.marginLeft + 'px',
      'border-width': this.borderWidth + 'px',
      'border-style': this.borderStyle,
      'border-color': 'rgb(' + this.borderColor + ')',
      background: 'rgb(' + this.backgroundColor + ')'
    });
    
    this.controller.ok();
  }
}