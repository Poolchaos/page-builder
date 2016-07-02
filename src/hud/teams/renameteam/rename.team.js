import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class RenameTeam {
  
  constructor(dialogController) {
    
    this.controller = dialogController;
  }
  
}