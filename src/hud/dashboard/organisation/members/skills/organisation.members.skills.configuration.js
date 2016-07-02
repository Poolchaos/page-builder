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
@inject(OrganisationMembersStore, PromptFactory)
export class OrganisationMembersSkillsConfig {

    constructor(organisationMembersStore, promptFactory) {

      this.organisationMembersStore = organisationMembersStore;
      this.promptFactory = promptFactory;
    }

    get helmViewModel() {

      return 'hud/dashboard/organisation/members/skills/organisation.members.skills.helm';
    }

    get portItems() {

      let selectMembersPrompt = this.promptFactory.buildMultiSelectOnlyPrompt('Members', this.organisationMembersStore.members, ORGANISATION_MEMBERS_ACTIONS.SELECT_MEMBERS);
      selectMembersPrompt.promptModel.icon = 'members';
      selectMembersPrompt.promptModel.display = 'text';

      return [

        {
          name: 'Members',
          viewModel: 'hud/dashboard/organisation/members/skills/members/organisation.members.skills.members',
          option: selectMembersPrompt
        }
      ];
    }

    get starboardItems() {

      // TODO this is used somewhere else... make it reusable?
      
      let skillGroupsPrompt = () => {
        
        let prompt = this.promptFactory.buildSingleSelectOnlyPrompt('Skill Groups', this.organisationMembersStore.groups, ORGANISATION_MEMBERS_ACTIONS.SELECT_SKILL_GROUP);
        prompt.promptModel.icon = 'skillgroups';
        return prompt;
      };
      
      let groupSkillsPrompt = (group) => {
        
        let skills = [];
        for (let skill of this.organisationMembersStore.skills) {
          
          if (skill.group === group.name) {
            skills.push(skill);
          }
        }
        
        let prompt = this.promptFactory.buildMultiSelectOnlyPrompt('Skills', skills, ORGANISATION_MEMBERS_ACTIONS.SELECT_SKILL);
        prompt.promptModel.icon = 'skills';
        return prompt;
      };

      return [

        {
          name: 'Skills',
          viewModel: 'hud/dashboard/organisation/members/skills/skills/organisation.members.skills.skills',
          option: {
            prompts: [skillGroupsPrompt, groupSkillsPrompt]
          }
        }
      ];
    }
}
