let compCount = 0;

export class ComponentService {
  
  createComponent(attrs) {
    
    compCount++;
    
    return {
      textField: components(attrs).textField,
      div: components(attrs).div
    }
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
  
  addFunctionality(this.template).delete();
  
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
function addFunctionality(el) {
  
  let remove = () => {
    
    let btn = document.createElement('div');
    btn.innerHTML = 'x';
    btn.className = 'btn_close';
    
    btn.onclick = () => {
      removeElement(el.id);
    };
    
    el.appendChild(btn);
  };
  
  return {
    delete: remove
  };
}
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
function removeElement(id) {
  
  let el = document.getElementById(id);
  
  if(!el) {
    
    setTimeout(() => {
      
      remove(id);
    }, 20);
    
    return;
  }
  
  content().removeChild(el);
}