/*
zailab
*/
import {OrganisationMembersStore} from '../organisation.members.store';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('OrganisationMembersAttributesHelm');

@inject(OrganisationMembersStore)
export class OrganisationMembersAttributesHelm {
  
  constructor(organisationMembersStore) {
    
    this.organisationMembersStore = organisationMembersStore;
  }
}