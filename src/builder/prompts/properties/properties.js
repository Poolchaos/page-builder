import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
/*
*/
import {LoggerManager} from 'zailab.common';
/*
*/
let logger;
/*
*/
@inject(DialogController, LoggerManager)
export class Properties {
  
  constructor(dialogController, loggerManager) {
    
    this.controller = dialogController;
    
    logger = loggerManager.createInstance('Properties');
    
//    logger.error('Is this an error??? ');
//    logger.debug('This is a notification ');
  }
}