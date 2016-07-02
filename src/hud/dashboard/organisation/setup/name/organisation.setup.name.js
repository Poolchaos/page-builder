/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {ORGANISATION_SETUP_ACTIONS} from '../organisation.setup.actions';
import {OrganisationSetupService} from '../organisation.setup.service';
import {OrganisationSetupStore} from '../organisation.setup.store';
/*
*/
const logger = LogManager.getLogger('OrganisationSetupName');
/*
*/
@inject(OrganisationSetupStore, OrganisationSetupService)
export class OrganisationSetupName {

  title = 'organisation';
  label;

  constructor(organisationSetupStore, organisationSetupService) {

    this.organisationSetupStore = organisationSetupStore;
    this.organisationSetupService = organisationSetupService;
  }

  activate(){

    this.setLabel();
  }

  setLabel() {

    this.label = this.organisationSetupStore.name;
    
  }

  @handle(ORGANISATION_SETUP_ACTIONS.CHANGE_ORGANISATION_NAME)
  @waitFor(OrganisationSetupStore);
  handleChangeOrganisationName(action, model) {

    let organisationName = this.organisationSetupStore.name;
    this.organisationSetupService.changeOrganisationName(organisationName);    
    
    this.setLabel();
  }  

}
