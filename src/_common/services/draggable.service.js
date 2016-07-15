import {inject} from 'aurelia-framework';
/*
*/
import {LoggerManager} from 'zailab.common';
/*
*/
let logger;
/*
*/
@inject(LoggerManager)
export class DraggableService {
  
  constructor(loggerManager) {
    
    logger = loggerManager.createInstance('Draggable Service');
  }
  
  isDragReady = false;
  dragoffset = {
    x: 0,
    y: 0
  };
  el;
  inContent = false;

  init(el) {
    
    this.getInitPosition(el);
    this.events(el);
  };

  getInitPosition(el) {
    
    el.initPos = {
      position: el.style.position,
      top: el.style.top,
      bottom: el.style.bottom,
      left: el.style.left
    };
  };

  resetPosition(el) {
    
    el.style.position = el.initPos.position;
    el.style.top = el.initPos.top;
    el.style.bottom = el.initPos.bottom;
    el.style.left = el.initPos.left;
  }

  events(el) {
    
    this._on(el, 'mousedown', (e) => {
      
      el.isDragReady = true;
      this.draggingElement = el;
      this.dragoffset.x = e.pageX - el.offsetLeft;
      this.dragoffset.y = e.pageY - el.offsetTop - 27;
      el.style['z-index'] = '999';
      el.style.position = 'fixed';
    });
    this._on(document, 'mouseup', (e) => {
      
      if(!this.draggingElement) return;
      
      this.draggingElement.isDragReady = false;
      this.resetPosition(el);
      this.draggingElement.style.position = 'relative';
      
      if(this.inContent) {
        
        
        this.data.service.addComponent(this.draggingElement);
        this.inContent = null;
      }
    });
    this._on(document, 'mousemove', (e) => {
      
      if (this.draggingElement && this.draggingElement.isDragReady) {
        
        var top = e.pageY - this.dragoffset.y;
        var left = e.pageX - this.dragoffset.x;
        var w = this.content.width();
        var h = this.content.height();

        this.inContent = !isElement(e, this.dragoffset).overContent();
        
        if (isElement(e, this.dragoffset).inView()) {
          
          return;
        }
        
        this.draggingElement.style.top = top + "px";
        this.draggingElement.style.bottom = "auto";
        this.draggingElement.style.left = left + "px";
      }
    });
  }


  initialiseMultiple(className, data) { // make multiple draggable elements
    
    this.els = document.getElementsByClassName(className);
    this.data = data ? data : '';
    this.initData = data;
    
    if(!this.els) {
      
      setTimeout(() => {
        this.initialiseMultiple(className, data);
      }, 10);
      
      return;
    }
        
    this.content = new content();
    
    for(let el of this.els) {
      
      this.init(el);
    }
  }
  
  _on(el, event, fn) {
    document.attachEvent ? el.attachEvent('on' + event, fn) : el.addEventListener(event, fn, !0);
  }
}
/*
*/
function isElement(e, dragoffset) {
  
  var winW = window.innerWidth;
  var winH = window.innerHeight;
  
  let checkTop = e.pageY < dragoffset.y;
  let checkBottom = e.pageY > (winH - (38 - dragoffset.y)); // 38 hardcoded because the source changes :: e.srcElement.clientHeight
  let checkLeft = e.pageX < dragoffset.x;
  let checkRight = e.pageX > winW - (38 - dragoffset.x); // 38 hardcoded because the source changes :: e.srcElement.clientWidth
  
  let overContent = () => {
    
    return checkTop || checkBottom || e.pageX < 200 || checkRight;
  };
  
  let inView = () => {
    
    return checkTop || checkBottom || checkLeft || checkRight;
  };
  
  return {
    overContent: overContent,
    inView: inView
  };
}
/*
*/
function content() {

  let content = () => {
    
    let el = document.getElementsByClassName('content')[0];
    
    if(!el) return false;
    
    return el;
  };

  let width = () => {
    return content().innerWidth;
  };

  let height = () => {
    return content().innerHeight;
  };
  
  return {
    getElement: content,
    width: width,
    height: height
  };
}