export class DraggableService {
  
  isDragReady = false;
  dragoffset = {
    x: 0,
    y: 0
  };
  el;
  inContent = false;

  init() {
    this.getInitPosition();
    this.events();
  };

  getInitPosition() {
    
    this.initPos = {
      position: this.el.style.position,
      top: this.el.style.top,
      bottom: this.el.style.bottom,
      left: this.el.style.left
    };
  };

  resetPosition() {
    
    this.el.style.position = this.initPos.position;
    this.el.style.top = this.initPos.top;
    this.el.style.bottom = this.initPos.bottom;
    this.el.style.left = this.initPos.left;
  }

  events() {
    this._on(this.el, 'mousedown', (e) => {
      this.isDragReady = true;
      this.dragoffset.x = e.pageX - this.el.offsetLeft;
      this.dragoffset.y = e.pageY - this.el.offsetTop;
    });
    this._on(document, 'mouseup', () => {
      this.isDragReady = false;
      this.resetPosition();
      
      if(this.data && this.inContent) {
        
        this.data.service.addComponent(this.el);
        this.data = null;
        this.inContent = null;
      }
      
      if(!this.data && this.inContent) {
        
        this.data = this.initData;
      }
    });
    this._on(document, 'mousemove', (e) => {
      if (this.isDragReady) {

//        console.log(' e >>>> ', e);
        
        let content = document.getElementsByClassName('content')[0];
        
        var top = e.pageY - this.dragoffset.y;
        var left = e.pageX - this.dragoffset.x;
        var w = content.innerWidth;
        var h = content.innerHeight;

        if (e.pageY < 28 || e.pageY > h || e.pageX < 200 || e.pageX > w) {
          this.inContent = false;
          return;
        }
        
        this.inContent = true;

        this.el.style.top = top + "px";
        this.el.style.bottom = "auto";
        this.el.style.left = left + "px";
      }
    });
  };

  initialise(id, data) {
    
    this.el = document.getElementById(id);
    this.data = data;
    this.initData = data;
    
    if(!this.el) {
      
      setTimeout(() => {
        this.initialise(id, data);
      }, 10);
      
      return;
    }
    
    this.init();
  }
  
  _on(el, event, fn) {
    document.attachEvent ? el.attachEvent('on' + event, fn) : el.addEventListener(event, fn, !0);
  }

}