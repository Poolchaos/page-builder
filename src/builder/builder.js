/*
*/
import {handle} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {Router} from 'aurelia-router';
/*
*/
import {DraggableService, PageStore} from 'zailab.common';
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
@inject(Router, PageStore, DraggableService, BuilderStore, ComponentService, BuilderService)
export class Builder {
  
  constructor(router, pageStore, draggableService, builderStore, componentService, builderService) {
    
    this.router = router;
    this.pageStore = pageStore;
    this.draggableService = draggableService;
    this.builderStore = builderStore;
    this.componentService = componentService;
    this.builderService = builderService;
    this.init();
  }
  
  init() {
    
    logger.debug(' builder initialised ');
    
    this.getContentArea();
  }
  
  getContentArea() {
    
    let content = document.getElementsByClassName('content')[0];
    
    if(!this.content) {
      
      setTimeout(() => {
        
        this.getContentArea();
      }, 50);
    }
    
    console.log(' this.content 1 >>> ', this.content);
    this.content = content;
    
    this.draggableService.initialiseMultiple('draggable_comp_create', {
      service: this.builderService
    });
  }
  
  back() {
    
    this.router.navigate('menu');
  }
  
  @handle(BUILDER_ACTIONS.GET_COMPONENT)
  handleGetComponent(action, component) {
    
    
    let componentId = component.id.split('draggable_')[1];
    
    console.log(' GET_COMPONENT >> componentId = ', componentId);
    console.log(' this.componentService.createComponent({}) >>>> ', this.componentService.createComponent({}));
//    console.log(' this.componentService.createComponent({})[componentId] >>>> ', this.componentService.createComponent({})[componentId]);
    
//    try {
      
      let template = this.componentService.createComponent({})[componentId]();
      this.content.appendChild(template);
//    } catch(e) {
//      
//      console.log(' error occurred ', e);
//    }
//    [componentId]();//
  }
}