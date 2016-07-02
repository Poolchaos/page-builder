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
const logger = LogManager.getLogger('OrganisationAdminCos');
/*
*/
@inject(OrganisationAdminStore)
export class OrganisationAdminCos {

  properties = {
    title: '',
    position: 'left'
  };

  constructor(organisationAdminStore) {

    this.organisationAdminStore = organisationAdminStore;
  }

  setTitle() {

    this.properties.title = 'Admin cos';

    let items = this.organisationAdminStore.cos;
    for (let item of items) {
      if (item.isSelected === true) {
        this.properties.title += ' : ' + item.name;
      }
    }
  }

  activate() {
    this.setTitle();
  }

  @handle(ORGANISATION_ADMIN_ACTIONS.CHANGE_ADMIN_COS)
  handleChangeAdminCos(action, model) {
    this.setTitle();
  }
}
