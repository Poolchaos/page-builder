/*
*/
import {OrganisationSetupStore} from '../organisation.setup.store';
import {ORGANISATION_SETUP_ACTIONS} from '../organisation.setup.actions';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('OrganisationSetupPicture');
/*
*/
@inject(OrganisationSetupStore)
export class OrganisationSetupPicture {
  
  properties = {
    title: 'Organisation picture',
    position: 'right',
    display: 'name'
  };
  settings = {
    add: {enabled: false},
    delete: {enabled: true},
    select: {enabled: false},
    edit: {enabled: true}
  };
  prompt = {
    title: 'Change organisation picture',
    acceptAction: ORGANISATION_SETUP_ACTIONS.ACCEPT_CHANGE_ORGANISATION_SITE_NAME,
    cancelAction: ORGANISATION_SETUP_ACTIONS.CANCEL_CHANGE_ORGANISATION_SITE_NAME
  }
  items;

  constructor(organisationSetupStore) {

    this.organisationSetupStore = organisationSetupStore;
  }

  activate() {
    
    this.items = this.organisationSetupStore.sites;
  }
}
