import {handle} from 'aurelia-flux';
import {inject} from 'aurelia-framework';
/*
*/
import {BuilderStore, LoggerManager} from 'zailab.common';
/*
*/
let compCount = 0,
logger,
foundParent = false;
/*
*/
@inject(BuilderStore, LoggerManager)
export class ComponentService {
  
  constructor(builderStore, loggerManager) {
    
    logger = loggerManager.createInstance('Component Service');
    
    this.builderStore = builderStore;
  }
  
  createComponent(attrs) {
    
    compCount++;
    
    return {
      textField: components(attrs).textField,
      div: components(attrs).div
    }
  }
  
  @handle('builder.component.remove')
  handleRemoveComponent() {
    
    foundParent = false;
    removeElement(this.builderStore.itemContextMenu, content());
  }
}
/*
*/
function content() {
    
  let el = document.getElementsByClassName('content')[0];

  if(!el) {
    
    setTimeout(() => {
      
      content();
    }, 20);
  } else {
    
    return el;
  }
}
/*
*/
function components(attrs) {
  
  return {
    textField: new textField,
    div: new div
  };
}
/*
*/
function div() {
  
  this.template = document.createElement('div');
  this.template.className = 'default_comp';
  
  defaultStyle(this.template);
  
//  addFunctionality(this.template).delete();
  
  this.element = () => { 
    return this.template;
  };

  return {
    el: this.element
  };
}
/*
*/
function textField() {
    
  this.template = document.createElement('input');
  this.template.type = 'text';
  
  // Wrap textfield in a div
  //  addFunctionality(this.template).delete();
  
  this.element = () => { 
    return this.template;
  };

  return {
    el: this.element
  };
}
/*
*/
//function addFunctionality(el) {
//  
//  let remove = () => {
//    
//    let btn = document.createElement('div');
//    btn.innerHTML = 'x';
//    btn.className = 'btn_close';
//    
//    clickEvent(btn, () => {
//      removeElement(el.id);
//    });
//    
//    el.appendChild(btn);
//  };
//  
//  let clickEvent = (el, callback) => {
//    
//    el.onclick = () => {
//      callback();
//    };
//  };
//  
//  return {
//    delete: remove
//  };
//}
/*
*/
function defaultStyle(el) {
  
  el.style.width = '100px';
  el.style.height = '100px';
  el.style.cursor = 'default';
  el.id = 'ui_' + compCount + '_comp';
}
/*
*/
function removeElement(item, parent) {
  
  let el = document.getElementById(item);
  
  if(!el) {
    
    setTimeout(() => {
      
      remove(item);
    }, 20);
    
    return;
  }
  
  if(is(item).childOf(parent)) {
    
    foundParent = true;
    $('.' + parent.className).find('#' + item)[0].parentNode.removeChild(el);
  } else if(!foundParent) {
    
    for(let node of parent.childNodes) {
      
      removeElement(item, node);
    }
  }
}
/*
*/
function is(item) {
  
  let hasChild = (parent) => {
    
    return $('.' + parent.className).find('#' + item).length;
  };
  
  return {
    childOf: hasChild
  }
}
