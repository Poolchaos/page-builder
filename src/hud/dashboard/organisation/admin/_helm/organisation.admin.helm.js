import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';

const logger = LogManager.getLogger('OrganisationAdminHelm');

@inject(Router)
export class OrganisationAdminHelm {
  
  constructor(router) {
    
    this.router = router;
  }
  
  setup() {
    this.router.navigate('setup');
  }
}