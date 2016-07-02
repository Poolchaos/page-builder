/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {Router} from 'aurelia-router';
/*
*/
const logger = LogManager.getLogger('Builder');

@inject(Router)
export class Builder {
  
  constructor(router) {
    
    this.router = router;
    this.init();
  }
  
  init() {
    
    logger.debug(' builder initialised ');
  }
  
  back() {
    
    this.router.navigate('menu');
  }
}