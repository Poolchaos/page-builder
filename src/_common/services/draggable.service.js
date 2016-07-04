export class DraggableService {
  
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
    
    console.log(' events > el = ', el);
    
    this._on(el, 'mousedown', (e) => {
      
      el.isDragReady = true;
      
      console.log(' isDragReady ');
    });
    this._on(document, 'mouseup', () => {
      
      el.isDragReady = false;
      console.log(' notDragReady ');
      this.resetPosition(el);
      
      if(this.data && this.inContent) {
        
        this.data.service.addComponent(el);
        this.data = null;
        this.inContent = null;
      }
      
      if(!this.data && this.inContent) {
        
        this.data = this.initData;
      }
    });
    this._on(el, 'mousemove', (e) => {
      if (this.isDragReady) {
        
        console.log(' is drag ready', e.pageY, ' - ' , e.pageX);
        
        var top = e.pageY - el.dragoffset.y;
        var left = e.pageX - el.dragoffset.x;
        var w = this.content.innerWidth;
        var h = this.content.innerHeight;

        if (e.pageY < 28 || e.pageY > h || e.pageX < 200 || e.pageX > w) {
          this.inContent = false;
          console.log(' out of content ');
          return;
        }
        
        console.log(' mousemove ');
        console.log(' inContent ');
        
        this.inContent = true;

        el.style.top = top + "px";
        el.style.bottom = "auto";
        el.style.left = left + "px";
      }
    });
  };

//  initialise(id, data) { // make single draggable element
//    
//    this.el = document.getElementById(id);
//    this.data = data;
//    this.initData = data;
//    
//    if(!this.el) {
//      
//      setTimeout(() => {
//        this.initialise(id, data);
//      }, 10);
//      
//      return;
//    }
//    
//    this.init();
//  }

  initialiseMultiple(className, data) { // make multiple draggable elements
    
    this.els = document.getElementsByClassName(className);
    this.data = data;
    this.initData = data;
    
    if(!this.els) {
      
      setTimeout(() => {
        this.initialise(id, data);
      }, 10);
      
      return;
    }
        
    this.content = document.getElementsByClassName('content')[0];
    
    for(let el of this.els) {
      
      this.init(el);
    }
  }
  
  _on(el, event, fn) {
    document.attachEvent ? el.attachEvent('on' + event, fn) : el.addEventListener(event, fn, !0);
  }

}