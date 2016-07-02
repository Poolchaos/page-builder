import {PromptFactory} from 'zailab.framework';
/*
*/
import {inject} from 'aurelia-framework';
/*
*/
import {ORGANISATION_PROFILE_ACTIONS} from './organisation.profile.actions';
import {OrganisationProfileStore} from './organisation.profile.store';
/*
*/
@inject(PromptFactory, OrganisationProfileStore)
export class OrganisationProfileConfig {

    constructor(promptFactory, organisationProfileStore) {

      this.promptFactory = promptFactory;
      this.organisationProfileStore = organisationProfileStore;
    }

    get helmViewModel() {

      return 'hud/dashboard/organisation/manage/organisation.profile.helm';
    }

    get portItems() {

      let changeNameModel = {name: this.organisationProfileStore.organisationInfo.organisationName};
      let changeNamePrompt = this.promptFactory.buildFormPrompt('Name', changeNameModel, ORGANISATION_PROFILE_ACTIONS.CHANGE_NAME);

      changeNamePrompt.promptModel.icon = 'name';

      return [
          {
            name: 'Name',
            icon: 'name',
            viewModel: 'hud/dashboard/organisation/manage/name/organisation.profile.name',
            option: changeNamePrompt
          }
        ];
    }

    get starboardItems() {

      
      let changeProfilePicturePrompt = this.promptFactory.buildPicturePrompt('Upload Picture', ORGANISATION_PROFILE_ACTIONS.CHANGE_PICTURE);
      changeProfilePicturePrompt.promptModel.icon = 'picture';

      return [
          {
            name: 'Picture',
            icon: 'name',
            viewModel: 'hud/dashboard/organisation/manage/picture/organisation.profile.picture',
            option: changeProfilePicturePrompt
          }
        ];

    }

}
