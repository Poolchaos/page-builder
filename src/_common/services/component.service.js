import {handle} from 'aurelia-flux';
import {inject} from 'aurelia-framework';
/*
*/
import {BuilderStore, LoggerManager} from 'zailab.common';
import {PAGE_LAYOUT} from '../stores/page.layout';
/*
*/
let compCount = 0,
logger,
foundParent = false,
numConnectors = 0;
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
      div: components(attrs).div,
      img: components(attrs).img
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
    div: new div(attrs),
    img: new img
  };
}
/*
*/
function getEvent(attrs) {

  for(var event in PAGE_LAYOUT.items) {

    if(!PAGE_LAYOUT.items[event] || !PAGE_LAYOUT.items[event].eventId) continue;

    if(PAGE_LAYOUT.items[event].eventId === attrs.eventId) {
      return PAGE_LAYOUT.items[event];
    }
  }
}
/*
*/
function div(attrs) {

  var event = (JSON.parse(JSON.stringify(getEvent(attrs))));
  event.left = attrs.x + 'px';
  event.top = attrs.y + 'px';

  this.template = document.createElement('div');
  this.template.className = 'default_comp draggable';

  var layer = document.createElement('div');
  layer.className = 'layer';

  this.template.style.position = 'absolute';
  this.template.style.left = attrs.x + 'px';
  this.template.style.top = attrs.y + 'px';

  var icon = document.createElement('img');
  icon.setAttribute('src', './src/_assets/img/' + attrs.eventId + '_icon.png');
  icon.className = 'icon';
  this.template.appendChild(icon);
  this.template.appendChild(layer);

  var newComp = addConnectors(this.template, attrs);

  if(newComp.hasPopup) {
    var view = document.createElement('div');
    view.className = 'open_prompt';
    view.innerHTML = 'edit';
    // view.setAttribute('click.delegate', editNode(newComp));
    this.template.appendChild(view);
  }

  var label = document.createElement('label');
  label.innerHTML = newComp.name;
  this.template.appendChild(label);
  // defaultStyle(this.template);
  
//  addFunctionality(this.template).delete();
  
  this.element = () => { 
    return {
      template: this.template,
      event: event
    };
  };

  return {
    el: this.template,
    event: event
  };
}
/*
*/
function addConnectors(template, attrs) {

  let comp;

  PAGE_LAYOUT.items.forEach(function(event) {
    if(event.eventId === attrs.eventId) {
      comp = event;
    }
  });

  comp.inConnectors = [];
  comp.outConnectors = [];

  var outCount = 0, inCount = 0, connectorGroupOut, connectorGroupIn, inConnector, outConnector;

  if(comp && comp.type === 'startEvent') {
    inCount = 0;
    outCount = 1;
  } else if(comp && comp.type === 'intermediateEvent') {
    inCount = 1;
    outCount = 1;
  }

  for(var incoming = 0; incoming < inCount; incoming++) {
    connectorGroupOut = document.createElement('ul');
    inConnector = document.createElement('li');
    inConnector.className = 'connector';
    inConnector.id = 'connector_' + numConnectors;
    inConnector.onmouseover = connectorMouseOver;
    inConnector.onmouseout = connectorMouseLeave;
    connectorGroupOut.appendChild(inConnector);
    connectorGroupOut.className = 'connectorGroup out';
    comp.inConnectors.push({id: 'connector_' + numConnectors});
    numConnectors++;
  }

  for(var outgoing = 0; outgoing < outCount; outgoing++) {
    connectorGroupIn = document.createElement('ul');
    outConnector = document.createElement('li');
    outConnector.className = 'connector';
    outConnector.id = 'connector_' + numConnectors;
    outConnector.onmouseover = connectorMouseOver;
    outConnector.onmouseout = connectorMouseLeave;
    connectorGroupIn.appendChild(outConnector);
    connectorGroupIn.className = 'connectorGroup in';
    comp.outConnectors.push({id: 'connector_' + numConnectors});
    numConnectors++;
  }

  if(connectorGroupIn) {
    template.appendChild(connectorGroupIn);
  }
  if(connectorGroupOut) {
    template.appendChild(connectorGroupOut);
  }

  return comp;
}
/*
*/
function textField() {
    
  this.template = document.createElement('input');
  this.template.type = 'text';
  
  // Wrap textfield in a div
  //  addFunctionality(this.template).delete();
  
  this.element = (x, y) => {
    return this.template;
  };

  return {
    el: this.element
  };
}
/*
*/
function img() {

  this.template = document.createElement('img');

  this.template.src = 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=0ahUKEwiEge6toofQAhVBtBoKHUBECqMQjBwIBA&url=https%3A%2F%2Fwww.royalcanin.com%2F~%2Fmedia%2FRoyal-Canin%2FProduct-Categories%2Fcat-adult-landing-hero.ashx&psig=AFQjCNFIlqjAxqSK_wL9T0dBvoFQpm7lKg&ust=1478079765969232';
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
  
  $('.' + parent.className).find('#' + item)[0].parentNode.removeChild(el);
}
/*
*/
//function is(item) {
//  
//  let hasChild = (parent) => {
//    
//    return $('.' + parent.className).find('#' + item).length;
//  };
//  
//  return {
//    childOf: hasChild
//  }
//}
function connectorMouseOver(e) {
  e.srcElement.className = e.srcElement.className + ' hover';
}
function connectorMouseLeave(e) {
  e.srcElement.className = e.srcElement.className.replace('hover', '');
}