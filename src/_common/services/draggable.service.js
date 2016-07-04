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
    
    this._on(el, 'mousedown', (e) => {
      
      el.isDragReady = true;
      this.draggingElement = el;
      this.dragoffset.x = e.pageX - el.offsetLeft;
      this.dragoffset.y = e.pageY - el.offsetTop;
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
        
//        console.log('el >>> ', el);
        
        var top = e.pageY - this.dragoffset.y;
        var left = e.pageX - this.dragoffset.x;
        var w = this.content.innerWidth;
        var h = this.content.innerHeight;

        if (e.pageY < 28 || e.pageY > h || e.pageX < 200 || e.pageX > w) {
          this.inContent = false;
          return;
        }
        
        this.inContent = true;
        this.draggingElement.style.top = top + "px";
        this.draggingElement.style.bottom = "auto";
        this.draggingElement.style.left = left + "px";
      }
    });
  };


  initialiseMultiple(className, data) { // make multiple draggable elements
    
    this.els = document.getElementsByClassName(className);
    this.data = data ? data : '';
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