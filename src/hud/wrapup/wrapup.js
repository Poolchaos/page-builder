import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle} from 'aurelia-flux';
import {HeadsUpDisplayStore} from '../hud.store';
import {CustomerStore} from '../hud.customer.store';
import {WrapUpService} from './wrapup.service';
import {WrapUpStore} from './wrapup.store';
import {WRAP_UP_ACTIONS} from './wrapup.actions';

const logger = LogManager.getLogger('WrapUp');

@inject(Router, HeadsUpDisplayStore, CustomerStore, WrapUpService, WrapUpStore)
export class WrapUp {

  constructor(router, headsUpDisplayStore, customerStore, wrapUpService, wrapUpStore) {
    
    this.router = router;
    this.headsUpDisplayStore = headsUpDisplayStore;
    this.customerStore = customerStore;
    this.wrapUpService = wrapUpService;
    this.wrapUpStore = wrapUpStore;
  }
  
  activate() {
    
    this.wrapUpService.activateWrapUp();
  }
  
  wrapUp() {
    
    this.wrapUpService.completeWrapUp();
  }
  
  showSignedDocs() {
    
    this.router.navigate('signdocument');
  }

  showScannedDocs() {
    
    this.router.navigate('scandocument');
  }
  
  showFingerprints() {
    
    this.router.navigate('scanfingerprint');
  }
  
  @handle(WRAP_UP_ACTIONS.COMPLETE_WRAP_UP)
  handleCompleteWrapUp() {
    
    this.router.navigate('');
  }
}
