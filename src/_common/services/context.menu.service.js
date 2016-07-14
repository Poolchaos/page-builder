import {inject} from 'aurelia-framework';
/*
*/
import {Dispatcher} from 'aurelia-flux';
/*
*/
let menuState = {
  default_comp: false,
  active: null
},
classes = {
  default_comp: 'component context_menu'
};
/*
*/
@inject(Dispatcher)
export class ContextMenuService {
  
  constructor(dispatcher) {
    
    listenForClickEvents();
    
    return {
      addContextMenu: el => {
        addContextMenu(el, dispatcher);
      },
      hideCentextMenu: hideCentextMenu
    };
  }
}
/*
*/
function addContextMenu(el, dispatcher) {
  
  el.addEventListener('contextmenu', function(e) {
    
    e.preventDefault();
    
    if(clickingInsideContextMenu(e)) {
      return;
    }
        
    dispatcher.dispatch('builder.component.context.menu', el.id);
    
    toggleMenuOn('component', el, e);
  });
}
/*
*/
function toggleMenuOn(option, el, e) {
  
  let className = el.className;
  
  let menu = document.getElementsByClassName(classes[className])[0];
  
  menuState[className] = !menuState[className];
    
  let left = e.pageX + 'px';
  let top = e.pageY + 'px';

  menu.style.left = left;
  menu.style.top = top;
  menu.className = menu.className + ' active';
}
/*
*/
function mouseDownCallback(evt) {
  
  if(clickingInsideContextMenu(evt) === 'undefined') {
    
    setTimeout(() => {
      
      mouseDownCallback(evt);
    }, 20);
    return;
  }
  
  if(clickingInsideContextMenu(evt)) return true;
  
  hideCentextMenu();
}
/*
*/
function hideCentextMenu() {
  
  let menus = document.getElementsByClassName('context_menu');

  for(let menu of menus) {

    menu.className = menu.className.replace(' active', '');
  }
}
/*
*/
function listenForClickEvents() {
  
  document.addEventListener('mousedown', (evt) => {
  
    evt.preventDefault();
    mouseDownCallback(evt);
  });
}
/*
*/
function clickingInsideContextMenu(evt, parent) {
  
  let parentNode = parent ? parent.parentElement : evt.srcElement.parentElement;
  
  if(parentNode.tagName === 'BODY') return false;
  
  if(classFoundIn(evt.srcElement, 'context_menu') || classFoundIn(parentNode, 'context_menu')) {
  
    return true;  
  } else {
  
    return clickingInsideContextMenu(evt, parentNode);
  }
}
/*
*/
function classFoundIn(element, className) {
  return (element.className).indexOf(className) > -1;
}