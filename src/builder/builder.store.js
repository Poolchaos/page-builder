import {handle} from 'aurelia-flux';
/*
*/
import {BUILDER_ACTIONS} from './builder.actions';
/*
*/
let STATE = {
  itemContextMenu: null
};
/*
*/
export class BuilderStore {

  get itemContextMenu() {
  
    return STATE.itemContextMenu;
  }
  
  @handle(BUILDER_ACTIONS.GET_COMPONENT)
  handleGetComponent(action, component) {
    
    
  }
  
  @handle('builder.component.*')
  handleOpenContextMenuForComponent(action, id) {
    
    if(action.indexOf('context.menu') !== -1) {
    
      STATE.itemContextMenu = id;
    }
  }
}