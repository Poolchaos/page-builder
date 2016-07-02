/*
*/
import {OrganisationSkillsPrompt} from '../../_prompts/organisation.skills.prompt';
/*
*/
import {OrganisationMembersStore} from '../organisation.members.store';
import {ORGANISATION_MEMBERS_ACTIONS} from '../organisation.members.actions';
/*
*/
import {PromptFactory} from 'zailab.framework';
/*
*/
import {inject} from 'aurelia-framework';
/*
*/
@inject(OrganisationSkillsPrompt, OrganisationMembersStore, PromptFactory)
export class OrganisationMembersAttributesConfig {

    constructor(organisationSkillsPrompt, organisationMembersStore, promptFactory) {

      this.organisationSkillsPrompt = organisationSkillsPrompt;
      this.organisationMembersStore = organisationMembersStore;
      this.promptFactory = promptFactory;
    }

    get helmViewModel() {

      return 'hud/dashboard/organisation/members/attributes/organisation.members.attributes.helm';
    }

    get portItems() {

      let changeSitePrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Select a Site', this.organisationMembersStore.sites, ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SITE);
      changeSitePrompt.promptModel.icon = 'sites';
      changeSitePrompt.promptModel.display = 'siteName';

      let changeCosPrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Select a Class Of Service', this.organisationMembersStore.cos, ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_COS);
      changeCosPrompt.promptModel.icon = 'class-of-service';

      let changeSkillsPrompt = () => {

        return this.organisationSkillsPrompt.make(this.organisationMembersStore.member.skills, ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SKILLS);
      };

      let viewModel = [

        {
          name: 'Site',
          viewModel: 'hud/dashboard/organisation/members/attributes/site/organisation.members.attributes.site',
          option: changeSitePrompt,
          icon: 'sites'
        },
        {
          name: 'Class of Service',
          viewModel: 'hud/dashboard/organisation/members/attributes/cos/organisation.members.attributes.cos',
          option: changeCosPrompt,
          icon: 'class-of-service'
        }

      ];

      if (this.organisationMembersStore.member.role !== 'Admin') {

        viewModel.push({
          name: 'Skills',
          viewModel: 'hud/dashboard/organisation/members/attributes/skills/organisation.members.attributes.skills',
          option: {
            prompts: [changeSkillsPrompt]
          },
          icon: 'skills'
        });
      }

      return viewModel;
    }

    get starboardItems() {

      let changeRolePrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Select a Role', this.organisationMembersStore.roles, ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_ROLE);
      changeRolePrompt.promptModel.icon = 'roles';

      let changeNumbersPrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Number', this.organisationMembersStore.numbers, ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_NUMBER);
      changeNumbersPrompt.promptModel.icon = 'numbers';
      changeNumbersPrompt.promptModel.display = 'number';

      let changeServicesPrompt = this.promptFactory.buildMultiSelectOnlyPrompt('Select Services', this.organisationMembersStore.services, ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SERVICES);
      changeServicesPrompt.promptModel.icon = 'services';
      changeServicesPrompt.promptModel.display = 'serviceName';

      let changeChannelPrompt = this.promptFactory.buildMultiSelectOnlyPrompt('Select Channels', this.organisationMembersStore.channels, ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_CHANNEL);
      changeChannelPrompt.promptModel.icon = 'channels';

      let viewModel =  [
        {
          name: 'Role',
          viewModel: 'hud/dashboard/organisation/members/attributes/role/organisation.members.attributes.role',
          option: changeRolePrompt,
          icon: 'role'
        },
				/*{
          name: 'Number',
          viewModel: 'hud/dashboard/organisation/members/attributes/number/organisation.members.attributes.number',
          option: {},
          icon: 'numbers'
        },*/

        {
          name: 'Services',
          viewModel: 'hud/dashboard/organisation/members/attributes/services/organisation.members.attributes.services',
          option: changeServicesPrompt,
          icon: 'services'
        }
      ];

      if (this.organisationMembersStore.member.role !== 'Admin') {

        viewModel.push({
          name: 'Channel',
          viewModel: 'hud/dashboard/organisation/members/attributes/channel/organisation.members.attributes.channel',
          option: changeChannelPrompt,
          icon: 'channels'
        });
      }

      return viewModel;
    }

}
