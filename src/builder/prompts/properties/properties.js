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
    
    logger = loggerManager.createInstance('Properties');
    
    this.controller = dialogController;
    
    logger.error('This is an error!!!');
    logger.warn('This is a WARNING!!!');
    logger.debug('This is a notification!!!');
  }
}