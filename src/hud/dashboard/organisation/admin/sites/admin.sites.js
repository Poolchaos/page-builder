/*
*/
import {ORGANISATION_ADMIN_ACTIONS} from '../organisation.admin.actions';
import {OrganisationAdminStore} from '../organisation.admin.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationAdminSites');
/*
*/
@inject(OrganisationAdminStore)
export class OrganisationAdminSites {

  properties = {
    title: '',
    position: 'right'
  };

  constructor(organisationAdminStore) {

    this.organisationAdminStore = organisationAdminStore;
  }

  setTitle() {

    this.properties.title = 'Admin site';

    let items = this.organisationAdminStore.sites;
    for (let item of items) {
      if (item.isSelected === true) {
        this.properties.title += ' : ' + item.name;
        break;
      }
    }
  }

  activate() {
    this.setTitle();
  }

  @handle(ORGANISATION_ADMIN_ACTIONS.CHANGE_ADMIN_SITES)
  handleChangeAdminSites(action, model) {
    this.setTitle();
  }
}
