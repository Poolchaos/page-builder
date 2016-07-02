import {OrganisationProfileStore} from './organisation.profile.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/

const logger = LogManager.getLogger('OrganisationMembersAttributesHelm');

@inject(OrganisationProfileStore)
export class OrganisationProfileHelm {
  
  constructor(organisationProfileStore) {
    
    this.organisationProfileStore = organisationProfileStore;
  }
  
}