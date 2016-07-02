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
const logger = LogManager.getLogger('OrganisationProfilePicture');
/*
*/
@inject(OrganisationProfileStore, OrganisationProfileService)
export class OrganisationProfilePicture {

  title = 'picture';
  label;
  display = 'name';

  _picture = null;

  constructor(organisationProfileStore, organisationProfileService) {
    
    this.organisationProfileStore = organisationProfileStore;
    this.organisationProfileService = organisationProfileService;
  }

  activate(){

    this.setProfilePicture();
  }

  setProfilePicture(url) {
 
    this._picture = [
      {
        pictureId: this.organisationProfileStore.organisationInfo.organisationId,
        defaultPicture: 'target/_assets/img/profile_pic-holder.png',
        name: this.organisationProfileStore.organisationInfo.organisationName,
        pictureURL: url
      }
    ];
  }

  @handle(ORGANISATION_PROFILE_ACTIONS.CHANGE_NAME)
  @waitFor(OrganisationProfileStore)
  handleChangeName(action, model){

    this.setProfilePicture();
  }

  @handle(ORGANISATION_PROFILE_ACTIONS.CHANGE_PICTURE)
  @waitFor(OrganisationProfileStore)
  handleChangePicture(action, base64){

    this.setProfilePicture(base64);
    let rawBase64 = base64.split('base64,')[1];

    this.organisationProfileService.updateProfilePicture(rawBase64);
  }

}
