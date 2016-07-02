/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
import {SortTools} from 'zailab.common';
/*
*/
import {ORGANISATION_KIOSKS_ACTIONS} from './organisation.kiosks.actions';
/*
*/
const logger = LogManager.getLogger('OrganisationKiosksStore');
/*
*/
import toastr from 'toastr';
/*
*/
let STATE = {

  kiosks: []
};
/*
*/
export class OrganisationKiosksStore {
  
  get kiosks() {
    
    return STATE.kiosks;
  }
  
  @handle(ORGANISATION_KIOSKS_ACTIONS.RETRIEVE_KIOSKS)
  handleRetrieveKiosks(action, kiosks) {
    
    for (let kiosk of kiosks) {

      kiosk.data = [kiosk.kioskName];
      kiosk.labelPosition = 'out';
      kiosk.labelClassName = 'o-crud-list__icon o-crud-list__icon--kiosk';
      
      if (kiosk.flowName && kiosk.flowName.length > 0) {
        
        kiosk.labelClassName = 'o-crud-list__icon o-crud-list__icon--flow';
        kiosk.data.push(kiosk.flowName);
      } else {
        
        kiosk.labelClassName = 'o-crud-list__icon o-crud-list__icon--kiosk';
      }
    }
    
    STATE.kiosks = kiosks;
  }
}