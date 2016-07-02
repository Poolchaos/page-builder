/*
*/
import {PromptService, PromptFactory} from 'zailab.framework';
/*
*/
import {ApplicationService, UserSession} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, Dispatcher} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationSkillsPrompt');
/*
*/
@inject(PromptService, PromptFactory, ApplicationService, UserSession, Dispatcher)
export class OrganisationSkillsPrompt {

  allItems;
  acceptAction;

  constructor(promptService, promptFactory, applicationService, userSession, dispatcher) {

    this.promptService = promptService;

    this.promptFactory = promptFactory;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.dispatcher = dispatcher;
  }

  make(storedSkills, acceptAction) {

    let skillIds = [];
    for (let storedSkill of storedSkills) {
      skillIds.push(storedSkill.skillId);
    }

    let _make = (items) => {

      prompt = this.promptFactory.buildTabPrompt('Select Skills', items, acceptAction);
      prompt.promptModel.icon = 'skills';
      return prompt;
    };

    let _error = () => {

      prompt = this.promptFactory.buildTabPrompt('Select Skills', [], acceptAction);
      prompt.promptModel.icon = 'skills';
      return prompt;
    };

    let organisationId = this.userSession.organisationId;

    let tabs = [];

    return new Promise((resolve) => {

      this.applicationService.displaySkillGroupsSearch(organisationId).then(
        (response) => {

          if (response.displaySkillGroupsView) {

            let skillGroupsView = response.displaySkillGroupsView[0];

            let length = skillGroupsView.skillGroups.length;
            let count = 0;

            if (length === 0) {

              //logger.error('changeSkillsPrompt > displaySkillGroupsSearch > no data found > response = ', response);

              resolve(_error());
            }

            for (let i = 0; i < length; i++) {

              let skillGroup = skillGroupsView.skillGroups[i];

              let tab = {
                labelClassName: 'o-crud-list__icon o-crud-list__icon--skills',
                id: skillGroup.skillGroupId,
                name: skillGroup.skillGroupName,
                items: [],
                isTab: true
              };

              this.applicationService.displaySkillsSearch(skillGroup.skillGroupId).then(
                (response) => {

                  count++;

                  if (response.displaySkillsView) {

                    let skillsView = response.displaySkillsView[0];

                    skillsView.skills.sort((skill1, skill2) => {

                      if (skill1.skillName < skill2.skillName) {
                        return -1;
                      }

                      if (skill1.skillName > skill2.skillName) {
                        return 1;
                      }

                      return 0;
                    });

                    for (let skill of skillsView.skills) {
                      tab.items.push({
                        labelClassName: 'o-crud-list__icon o-crud-list__icon--skill',
                        groupId: skillsView.skillGroupId,
                        id: skill.skillId,
                        name: skill.skillName,
                        isSelected: skillIds.indexOf(skill.skillId) !== -1
                      });
                    }

                    if (tab.items.length !== 0) {
                      tabs.push(tab);
                    }

                    if (count === length) {

                      resolve(_make(tabs));
                    }
                  } else {

                    if (count === length) {

                      resolve(_make(tabs));
                    }
                  }
                },
                (error) => {

                  //                  logger.error('changeSkillsPrompt > displaySkillGroupsSearch > displaySkillsSearch > error = ', error);

                  if (count === length) {
                    resolve(_error());
                  }
                }
              );
            }

          } else {

            //            logger.error('changeSkillsPrompt > displaySkillGroupsSearch > no data found > response = ', response);

            resolve(_error());
          }
        },
        (error) => {

          //          logger.error('changeSkillsPrompt > displaySkillGroupsSearch > error = ', error);

          resolve(_error());
        }
      );
    });
  }

  open(items, acceptAction) {

    this.promptService.openPrompt(this.make(items, acceptAction));
  }
}
