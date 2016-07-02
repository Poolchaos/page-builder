/*
*/
import {OrganisationAdminStore} from '../organisation.admin.store';
/*
*/
import {PROMPT_SETTINGS} from 'zailab.framework';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('OrganisationAdminServices');
/*
*/
@inject(OrganisationAdminStore)
export class OrganisationAdminServices {

  properties = {
    title: 'Admin services',
    position: 'left',
    display: 'name'
  };
  settings = PROMPT_SETTINGS.SELECT_ONE_ONLY;
  items;

  constructor(organisationAdminStore) {

    this.organisationAdminStore = organisationAdminStore;
  }

  activate() {

    this.items = this.organisationAdminStore.services;
  }
}
