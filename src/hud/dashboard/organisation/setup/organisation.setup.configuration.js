/*
*/
import {PromptFactory} from 'zailab.framework';
/*
*/
import {OrganisationSetupStore} from './organisation.setup.store';
import {ORGANISATION_SETUP_ACTIONS} from './organisation.setup.actions';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('OrganisationSetupConfig');
/*
*/
@inject(OrganisationSetupStore, PromptFactory)
export class OrganisationSetupConfig {

    constructor(organisationSetupStore, promptFactory) {

      this.organisationSetupStore = organisationSetupStore;
      this.promptFactory = promptFactory;
    }

    get helmViewModel() {

      return 'hud/dashboard/organisation/setup/_helm/organisation.setup.helm';
    }

    get portItems() {

      let changeNamePrompt = this.promptFactory.buildFormPrompt('Organisation name', {name: this.organisationSetupStore.name}, ORGANISATION_SETUP_ACTIONS.CHANGE_ORGANISATION_NAME);
      changeNamePrompt.promptModel.icon = 'organisation';

      return [

        {
          name: 'Name',
          viewModel: 'hud/dashboard/organisation/setup/name/organisation.setup.name',
          option: changeNamePrompt
        }
      ];
    }

    get starboardItems() {

      let changePicturePrompt = this.promptFactory.buildEditDeletePrompt('Organisation picture', this.organisationSetupStore.picture, ORGANISATION_SETUP_ACTIONS.CHANGE_ORGANISATION_SITES);
      changePicturePrompt.promptModel.icon = 'picture';

      return [

        {
          name: 'Picture',
          viewModel: 'hud/dashboard/organisation/setup/picture/organisation.setup.picture',
          option: changePicturePrompt
        }
      ];
    }
}
