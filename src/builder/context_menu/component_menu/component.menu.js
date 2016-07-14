import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {ContextMenuService, LoggerManager} from 'zailab.common';
/*
*/
import {DialogService} from 'aurelia-dialog';
import {Properties} from '../../prompts/properties/properties';
/*
*/
let logger;
/*
*/
@inject(Dispatcher, DialogService, ContextMenuService, LoggerManager)
export class ComponentMenu {
  
  constructor(dispatcher, dialogService, contextMenuService, loggerManager) {
    
    logger = loggerManager.createInstance('Component Menu');
    
    this.contextMenuService = contextMenuService;
    this.dialogService = dialogService;
    this.dispatcher = dispatcher;
  }
  
  open(option) {
    
    this.contextMenuService.hideCentextMenu();
    
    let viewModel;
    
    if(option === 'properties') {
    
      viewModel = Properties;
    }
    
    this.dialogService.open({ viewModel: Properties, model: 'Good or Bad?'}).then(response => {
      
      logger.debug(response.output);
      
      if (!response.wasCancelled) {
        
        logger.debug('good');
      } else {
        
        // do nothing
      }
    });
  }
  
  removeElement() {
    
    this.contextMenuService.hideCentextMenu();
    this.dispatcher.dispatch('builder.component.remove');
  }
}