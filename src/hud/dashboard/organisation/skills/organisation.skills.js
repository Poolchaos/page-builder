/*
*/
import {OrganisationSkillsStore} from './organisation.skills.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
const logger = LogManager.getLogger('OrganisationSkills');
/*
*/

@inject(OrganisationSkillsStore, Router)
export class OrganisationSkills {

  constructor(organisationSkillsStore, router) {
    this.organisationSkillsStore = organisationSkillsStore;
    this.router = router;
  }

  configureRouter(config, router) {

    let routeMap = [
      {route: '',                               name: 'skillGroups',  moduleId: 'hud/dashboard/organisation/skills/groups/organisation.skills.groups',   nav: false, title: 'Skill Groups'},
      {route: ':skillGroupName/:skillGroupId',  name: 'skills',       moduleId: 'hud/dashboard/organisation/skills/skills/organisation.skills.skills',   nav: false, title: 'Skills'}
    ];

    config.map(routeMap);
    this.router = router;
  }

}
