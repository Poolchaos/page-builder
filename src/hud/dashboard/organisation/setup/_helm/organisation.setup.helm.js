import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';

const logger = LogManager.getLogger('OrganisationSetupHelm');

@inject(Router)
export class OrganisationSetupHelm {
  
  constructor(router) {
    
    this.router = router;
  }
  
  admin() {
    
    this.router.navigate('admin');
  }
}