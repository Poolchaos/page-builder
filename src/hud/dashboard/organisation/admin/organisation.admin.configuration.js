/*
*/
import {OrganisationAdminStore} from './organisation.admin.store';
import {ORGANISATION_ADMIN_ACTIONS} from './organisation.admin.actions';
/*
*/
import {PromptFactory} from 'zailab.framework';
/*
*/
import {inject} from 'aurelia-framework';
/*
*/
@inject(OrganisationAdminStore, PromptFactory)
export class OrganisationAdminConfig {

    constructor(organisationAdminStore, promptFactory) {

      this.organisationAdminStore = organisationAdminStore;
      this.promptFactory = promptFactory;
    }

    get helmViewModel() {

      return 'hud/dashboard/organisation/admin/_helm/organisation.admin.helm';
    }

    get portItems() {
      
      let changeCosPrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Admin cos', this.organisationAdminStore.cos, ORGANISATION_ADMIN_ACTIONS.CHANGE_ADMIN_COS);
      changeCosPrompt.promptModel.icon = 'cos';
      
      let changeServicesPrompt = this.promptFactory.buildMultiSelectOnlyPrompt('Admin services', this.organisationAdminStore.services, ORGANISATION_ADMIN_ACTIONS.CHANGE_ADMIN_SERVICES);
      changeServicesPrompt.promptModel.icon = 'services';

      return [

        {
          name: 'COS', 
          viewModel: 'hud/dashboard/organisation/admin/cos/admin.cos', 
          option: changeCosPrompt
        },

        {
          name: 'Services', 
          viewModel: 'hud/dashboard/organisation/admin/services/admin.services', 
          option: changeServicesPrompt
        }
      ];
    }

    get starboardItems() {
      
      let changeSitesPrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Admin sites', this.organisationAdminStore.sites, ORGANISATION_ADMIN_ACTIONS.CHANGE_ADMIN_SITES);
      changeSitesPrompt.promptModel.icon = 'sites';

      return [

        {
          name: 'Sites', 
          viewModel: 'hud/dashboard/organisation/admin/sites/admin.sites', 
          option: changeSitesPrompt
        }
      ];
    }
}
