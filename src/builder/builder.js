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

  events = {
    properties: []
  };
  
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
    // logger.error('some error');
    
    setTimeout(() => {
      
      this.draggableService.initialiseMultiple('draggable', {
        service: this.builderService
      });
    }, 100);
  }
  
  back() {
    
    this.router.navigate('menu');
  }
  
  @handle(BUILDER_ACTIONS.GET_COMPONENT)
  handleGetComponent(action, els) {

    let componentId = els.component.id.split('draggable_')[1];
    let contentSection = els.container.className.replace('content_sec ', '');

    try {

      let obj = this.componentService.createComponent({x: els.x, y: els.y, eventId: componentId})['div'];// componentId
      // let content = document.getElementsByClassName(contentSection)[0];

      obj.event.id = 'node_' + this.events.properties.length;
      console.log('obj.event >>>>> ', obj.event);
      this.events.properties.push(obj.event);

      console.log('this.events.properties >>>> ', this.events.properties);
      
      // content.appendChild(obj.el);
      // this.contextMenuService.addContextMenu(obj.el());

      setTimeout(() => {
        this.draggableService.initialiseMultiple('draggable', null, true);
      }, 200);

    } catch(e) {

      logger.error(' contextMenu could not be added ', e);
    }
  }

  @handle('builder.component.style.change')
  handleChangeComponentStyle(action, options) {
    
    let component = document.getElementById(this.builderStore.itemContextMenu);
    
    for(let prop in options) {

      component.style[prop] = options[prop];
    }
  }
}