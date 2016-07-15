/*
*/
import {handle} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {Router} from 'aurelia-router';
/*
*/
import {DraggableService, PageStore, ContextMenuService} from 'zailab.common';
/*
*/
import {BuilderStore} from './builder.store';
import {BuilderService} from './builder.service';
import {ComponentService} from '../_common/services/component.service';
import {BUILDER_ACTIONS} from './builder.actions';
/*
*/
const logger = LogManager.getLogger('Builder');
/*
*/
@inject(Router, PageStore, DraggableService, BuilderStore, ComponentService, BuilderService, ContextMenuService)
export class Builder {
  
  constructor(router, pageStore, draggableService, builderStore, componentService, builderService, contextMenuService) {
    
    this.router = router;
    this.pageStore = pageStore;
    this.draggableService = draggableService;
    this.builderStore = builderStore;
    this.componentService = componentService;
    this.builderService = builderService;
    this.contextMenuService = contextMenuService;
    
    this.init();
  }
  
  init() {
    
    logger.debug(' builder initialised ');
    
    setTimeout(() => {
      
      this.draggableService.initialiseMultiple('draggable_comp_create', {
        service: this.builderService
      });
    }, 100);
  }
  
  back() {
    
    this.router.navigate('menu');
  }
  
  @handle(BUILDER_ACTIONS.GET_COMPONENT)
  handleGetComponent(action, component) {
    
    this.component = component;
    let componentId = component.id.split('draggable_')[1];
    
    events(componentId, this.componentService, this.contextMenuService).addEventListener();
  }
}

function events(componentId, componentService, contextMenuService) {
  
  let addEventListener = () => {
    
    document.addEventListener('mousemove', eventCallback);
  }
  
  let removeEventListener = () => {
    
    document.removeEventListener('mousemove', eventCallback);
  }
  
  let eventCallback = (e) => {
    
    let contentSection = e.srcElement.className.replace('content_sec ', '');
    addComponent(contentSection, componentId);
  }
  
  
  
  let addComponent = (contentSection, componentId) => {
    
    try {

      let obj = componentService.createComponent({})[componentId];
      let content = document.getElementsByClassName(contentSection)[0];
      
      content.appendChild(obj.el());
      contextMenuService.addContextMenu(obj.el());
      
      removeEventListener();

    } catch(e) {

      console.error(' error occurred ', e);
    }
  };
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
  }
}