import {inject} from 'aurelia-framework';
/*
*/
import {LoggerManager} from 'zailab.common';
/*
*/
let logger;
/*
*/
@inject(LoggerManager)
export ResizeService {
  
  constructor(loggerManager) {
    
    logger = loggerManager.createInstance('Resize Service');
  }
}