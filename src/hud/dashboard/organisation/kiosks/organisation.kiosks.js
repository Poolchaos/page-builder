/*
*/
import {Crud} from 'zailab.framework';
/*
*/
import {ORGANISATION_KIOSKS_ACTIONS} from './organisation.kiosks.actions';
import {OrganisationKiosksStore} from './organisation.kiosks.store'; // imported for waitFor
import {OrganisationKiosksService} from './organisation.kiosks.service';
//import {UniqueSiteValidationRule} from './organisation.sites.validation';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationKiosks');
/*
*/
@inject(OrganisationKiosksStore, OrganisationKiosksService)
export class OrganisationKiosks {
  
  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit: {enabled: false},
    labels: {enabled: false}
  };

  display = 'data';
  resolve = null;
  guide = 'This is a list of your kiosks in your organisation and how they have been allocated. A kiosk can be allocated to an interaction flow.';

  constructor(organisationKiosksStore, organisationKiosksService) {
    
    this.organisationKiosksStore = organisationKiosksStore;
    this.organisationKiosksService = organisationKiosksService;
  }

  canActivate() {
    
    this.organisationKiosksService.retrieveKiosks();
    
    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.organisationKiosksStore.kiosks.length;
  }
  
  @handle(ORGANISATION_KIOSKS_ACTIONS.RETRIEVE_KIOSKS)
  @waitFor(OrganisationKiosksStore)
  handleRetrieveKiosks(action, kiosks) {
    
    if (!this.organisationKiosksStore.kiosks || this.organisationKiosksStore.kiosks.length === 0) {

      this.noDataMessage = 'Please contact ZaiLab to add kiosks to your organisation.';
    }
    
     if (this.resolve !== null) {
      
      this.resolve(true);
      this.resolve = null;
    }
  }
}