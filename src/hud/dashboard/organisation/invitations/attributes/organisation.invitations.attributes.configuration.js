/*
*/
import {OrganisationSkillsPrompt} from '../../_prompts/organisation.skills.prompt';
/*
*/
import {OrganisationInvitationsStore} from '../organisation.invitations.store';
import {ORGANISATION_INVITATIONS_ACTIONS} from '../organisation.invitations.actions';
/*
*/
import {PromptFactory} from 'zailab.framework';
/*
*/
import {ApplicationService, UserSession} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('OrganisationInvitationsAttributesConfig');
/*
*/
@inject(OrganisationSkillsPrompt, OrganisationInvitationsStore, PromptFactory, ApplicationService, UserSession)
export class OrganisationInvitationsAttributesConfig {

    constructor(organisationSkillsPrompt, organisationInvitationsStore, promptFactory, applicationService, userSession) {

      this.organisationSkillsPrompt = organisationSkillsPrompt;
      this.organisationInvitationsStore = organisationInvitationsStore;
      this.promptFactory = promptFactory;
      this.applicationService = applicationService;
      this.userSession = userSession;
    }

    get helmViewModel() {

      return 'hud/dashboard/organisation/invitations/attributes/organisation.invitations.attributes.helm';
    }

    get portItems() {

      let changeSitePrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Select a Site', this.organisationInvitationsStore.sites, ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SITE);

      changeSitePrompt.promptModel.icon = 'sites';
      
      let changeCosPrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Select a Class of Service', this.organisationInvitationsStore.cos, ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_COS);

      changeCosPrompt.promptModel.icon = 'class-of-service';
      
      let changeSkillsPrompt = () => {

        return this.organisationSkillsPrompt.make(this.organisationInvitationsStore.invitation.skills, ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SKILL);
      };

      return [

          {
            name: 'Site',
            icon: 'sites',
            viewModel: 'hud/dashboard/organisation/invitations/attributes/site/organisation.invitations.attributes.site',
            option: changeSitePrompt
          },
          {
            name: 'Cos',
            icon: 'class-of-service',
            viewModel: 'hud/dashboard/organisation/invitations/attributes/cos/organisation.invitations.attributes.cos',
            option: changeCosPrompt
          },
          {
            name: 'Skills',
            icon: 'skills',
            viewModel: 'hud/dashboard/organisation/invitations/attributes/skill/organisation.invitations.attributes.skill',
            option: {
              prompts: [changeSkillsPrompt]
            }
          }
        ];
    }

    get starboardItems() {
      
      let changeServicePrompt = this.promptFactory.buildMultiSelectPrompt('Select Services', this.organisationInvitationsStore.services, ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SERVICE);

      let changeChannelPrompt = this.promptFactory.buildMultiSelectPrompt('Select Channels', this.organisationInvitationsStore.channels, ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_CHANNEL);

      changeChannelPrompt.promptModel.icon = 'channels';

      return [
        {
          name: 'Service',
          icon: 'services',
          viewModel: 'hud/dashboard/organisation/invitations/attributes/service/organisation.invitations.attributes.service',
          option: changeServicePrompt
        },
        {
          name: 'Channel',
          icon: 'teams',
          viewModel: 'hud/dashboard/organisation/invitations/attributes/channel/organisation.invitations.attributes.channel',
          option: changeChannelPrompt
        }

      ];

    }
}
