/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {OrganisationProfileStore} from '../organisation.profile.store';
import {OrganisationProfileService} from '../organisation.profile.service';
import {ORGANISATION_PROFILE_ACTIONS} from '../organisation.profile.actions';
/*
*/
const logger = LogManager.getLogger('OrganisationProfileName');
/*
*/
@inject(OrganisationProfileStore, OrganisationProfileService)
export class OrganisationProfileName {

  title = 'name';
  label;
  display = 'name';

  constructor(organisationProfileStore, organisationProfileService) {
    
    this.organisationProfileStore = organisationProfileStore;
    this.organisationProfileService = organisationProfileService;
  }

  activate(){

    this.setName(this.organisationProfileStore.organisationInfo.organisationName);
  }

  setName(name) {
 
    this.label = name;
  }

  @handle(ORGANISATION_PROFILE_ACTIONS.CHANGE_NAME)
  @waitFor(OrganisationProfileStore)
  handleChangeName(action, model){

    this.setName(model.item.name);
    this.organisationProfileService.changeName(model.item.name);
  }

}
