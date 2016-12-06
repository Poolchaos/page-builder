import {inject} from 'aurelia-framework';
/*
*/
import {LoggerManager} from 'zailab.common';
import {DrawLineService} from './line.service';
/*
*/
let logger;
/*
*/
@inject(LoggerManager, DrawLineService)
export class DraggableService {
  
  constructor(loggerManager, drawLineService) {
    
    logger = loggerManager.createInstance('Draggable Service');
    this.drawLineService = drawLineService;
  }
  
  isDragReady = false;
  dragoffset = {
    x: 0,
    y: 0
  };
  el;
  inContent = false;

  init(el) {
    if(!this.existing) {
      this.getInitPosition(el);
    }
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

      if(e.which === 3 || e.srcElement.className.indexOf('open_prompt') !== -1) return;

      if(e.srcElement.className.indexOf('line') !== -1) {
        return;
      }
      if(e.srcElement.className.indexOf('connector') !== -1) {
        this.drawConnection = true;
        this.drawConnector = e.srcElement;
        return;
      }
      this.drawConnection = false;
      this.drawConnector = null;

      if(e.srcElement.className.indexOf('default_comp') !== -1) {
        this.existing = true;
        this.selectedElement = e.srcElement;
      }
      if(e.srcElement.className.indexOf('layer') !== -1) {
        this.existing = true;
        this.selectedElement = e.srcElement.parentNode;
      }

      el.isDragReady = true;
      this.draggingElement = el;
      this.dragoffset.x = e.pageX - el.offsetLeft;
      this.dragoffset.y = e.pageY - el.offsetTop - 27;
    });
    
    this._on(document, 'mouseup', (e) => {

      if(this.drawConnection && e.srcElement.className.indexOf('connector') !== -1) {
        this.drawLineService.draw(null, null, e.srcElement);
        this.drawLineService.reset();
      } else {
        this.drawLineService.remove();
        this.drawLineService.reset();
      }

      this.drawConnection = false;
      this.drawConnector = null;
      if(!this.draggingElement || this.drawConnection) return;

      this.draggingElement.isDragReady = false;
      this.dragBox.style.display = 'none';

      if(this.inContent) {

        if(!this.existing) {
          this.data.service.addComponent({component: this.draggingElement, container: e.srcElement, x: e.offsetX, y: e.offsetY});
        }
        this.inContent = null;
        this.existing = false;
        this.selectedElement = false;
        this.drawLineService.reset();
      }
    });
    
    this._on(document, 'mousemove', (e) => {


      if(this.drawConnection) {
        this.drawLineService.draw(e, this.drawConnector);
      }

      if(e.srcElement.className.indexOf('connector') !== -1) {
        return;
      }
      
      // $('.content_sec.active').removeClass('active');
      
      if (this.draggingElement && this.draggingElement.isDragReady) {
      
        // if(e.srcElement.className.indexOf('content_sec') !== -1) {
        //   e.srcElement.className = e.srcElement.className + ' active'
        // }

        var w = this.content.width();
        var h = this.content.height();

        this.inContent = !isElement(e, this.dragoffset).overContent();
        
        if (isElement(e, this.dragoffset).inView()) {
          return;
        }

        var top, left;

        if(!this.existing) {
          top = (e.pageY - this.dragoffset.y);
          left = e.pageX - this.dragoffset.x;
          this.dragBox.style.display = 'block';
          this.dragBox.style.top = top + 'px';
          this.dragBox.style.bottom = 'auto';
          this.dragBox.style.left = left + 'px';
          return;
        }

        top = e.clientY - (this.selectedElement.clientHeight / 2)- 20;
        left = e.clientX - (this.selectedElement.clientWidth / 2);

        if(top < 0 || left < 0) return;

        this.selectedElement.style.top = (top - 10) + 'px';
        this.selectedElement.style.left = (left - 200) + 'px';

        if(this.drawLineService.hasConnectors()) {
          this.drawLineService.resetConnectors();
        }
      }
    });
  }
  
  _on(el, event, fn) {
    document.attachEvent ? el.attachEvent('on' + event, fn) : el.addEventListener(event, fn, !0);
  }

  initialiseMultiple(className, data, existing) { // make multiple draggable elements

    this.isExisting = existing;
    this.els = document.getElementsByClassName(className);
    this.dragBox = document.getElementsByClassName('drag-box')[0];
    this.data = this.data ? this.data: (data? data : '');

    if(!this.els) {
      
      setTimeout(() => {
        this.initialiseMultiple(className, data);
      }, 10);
      
      return;
    }
        
    this.content = new Content();
    
    for(let el of this.els) {
      
      this.init(el);
    }
  }

//   initialiseSingle(className, boj) { // make single draggable element
//
//     this.els = document.getElementsByClassName(className);
//
//     if(!this.els) {
//
//       setTimeout(() => {
//         this.initialiseSingle(className);
//       }, 10);
//
//       return;
//     }
//
//     for(let el of this.els) {
//
//       this.isNew = false;
//       this.init(el);
//     }
//   }
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
function Content() {

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