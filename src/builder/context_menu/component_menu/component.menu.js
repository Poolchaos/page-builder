import {inject} from 'aurelia-framework';
/*
*/
import {ContextMenuService} from 'zailab.common';
/*
*/
import {DialogService} from 'aurelia-dialog';
import {Properties} from '../../prompts/properties/properties';
/*
*/
@inject(DialogService, ContextMenuService)
export class ComponentMenu {
  
  constructor(dialogService, contextMenuService) {
    
    this.dialogService = dialogService;
    this.contextMenuService = contextMenuService;
  }
  
  open(option) {
    
    this.contextMenuService.hideCentextMenu();
    
    let viewModel;
    
    if(option === 'properties') {
    
      viewModel = Properties;
    }
    
    this.dialogService.open({ viewModel: Properties, model: 'Good or Bad?'}).then(response => {
      
      console.log(response.output);
      
      if (!response.wasCancelled) {
        
        console.log('good');
      } else {
        
        // do nothing
      }
    });
  }
}