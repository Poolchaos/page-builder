export class DraggableService {
  
  isDragReady = false;
  dragoffset = {
    x: 0,
    y: 0
  };
  el;

  init() {
    this.initPosition();
    this.events();
  };

  initPosition() {
    this.el.style.position = "fixed";
    this.el.style.top = "auto";
    this.el.style.bottom = "20px";
    this.el.style.left = "20px";
  };

  events() {
    this._on(this.el, 'mousedown', (e) => {
      this.isDragReady = true;
      this.dragoffset.x = e.pageX - this.el.offsetLeft;
      this.dragoffset.y = e.pageY - this.el.offsetTop;
    });
    this._on(document, 'mouseup', () => {
      this.isDragReady = false;
    });
    this._on(document, 'mousemove', (e) => {
      if (this.isDragReady) {

        var top = e.pageY - this.dragoffset.y;
        var left = e.pageX - this.dragoffset.x;
        var w = window.innerWidth;
        var h = window.innerHeight;

        if (e.pageY < 1 || e.pageY > h || e.pageX < 1 || e.pageX > w) {
          return;
        }

        this.el.style.top = top + "px";
        this.el.style.bottom = "auto";
        this.el.style.left = left + "px";
      }
    });
  };

  initialise(id) {

    this.el = document.getElementById(id);
    
    if(!this.el) {
      
      setTimeout(() => {
        this.initialise(id);
      }, 10);
      
      return;
    }
    
    this.init();
  }
  
  _on(el, event, fn) {
    document.attachEvent ? el.attachEvent('on' + event, fn) : el.addEventListener(event, fn, !0);
  }

}