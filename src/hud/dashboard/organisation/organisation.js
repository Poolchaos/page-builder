/*
*/
import {ORGANISATION_MENU_ITEMS} from './organisation.menu.items';
import {ORGANISATION_ACTIONS} from './organisation.actions';
import {OrganisationStore} from './organisation.store';
import {OrganisationService} from './organisation.service';
import {UserSession} from '../../../_common/stores/user.session';
/*
*/
import {PromptFactory, PromptService} from 'zailab.framework';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import uuid from 'node-uuid';

const logger = LogManager.getLogger('Organisation');
let COUNTER;

@inject(OrganisationStore, OrganisationService, UserSession, Router, EventAggregator, PromptFactory, PromptService)
export class Organisation {

  constructor(organisationStore, organisationService, userSession, router, eventAggregator, promptFactory, promptService) {

    this.organisationStore = organisationStore;
    this.organisationService = organisationService;
    this.userSession = userSession;
    this.router = router;
    this.eventAggregator = eventAggregator;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
  }

  activate() {

    COUNTER = 0;

    let personId = this.userSession.user.personId;
    this.organisationService.retrieveUserInfo(personId);

    let organisationId;
    for (var item in this.userSession.loggedInUser.userAccessRoles) {
      if (this.userSession.loggedInUser.userAccessRoles[item].accountType === 'ORGANISATION') {
        organisationId = this.userSession.loggedInUser.userAccessRoles[item].organisationId;
      }
    }

    if (organisationId) {
      this.organisationService.retrieveOrganisationInfo(organisationId);
    }


    if (this.organisationStore.isReady === false && !organisationId) {
      this.setupOrganisation();
    }

  }

  configureRouter(config, router) {

    let routeMap = [
      {route: '',       name: 'menu',   moduleId: 'hud/dashboard/organisation/menu/organisation.menu',             nav: false, title: 'Menu'},
      {route: 'admin',  name: 'admin',  moduleId: 'hud/dashboard/organisation/admin/organisation.admin',           nav: false, title: 'Admin'},
      {route: 'manage', name: 'manage', moduleId: 'hud/dashboard/organisation/manage/organisation.profile',        nav: false, title: 'Manage'},
      {route: 'setup',  name: 'setup',  moduleId: 'hud/dashboard/organisation/setup/organisation.setup',           nav: false, title: 'Setup'}
    ];

    addRouteMapMenuItems(routeMap, ORGANISATION_MENU_ITEMS.port);
    addRouteMapMenuItems(routeMap, ORGANISATION_MENU_ITEMS.starboard);

    config.map(routeMap);

    this.router = router;

    if (this.organisationStore.isReady === false) {

      //      this.router.navigate('/hud/dashboard/organisation');
    }
  }

  @handle(ORGANISATION_ACTIONS.RETRIEVE_ORGANISATION_INFO)
  @waitFor(OrganisationStore)
  handleRetrieveOrganisationInfo(action, organisation) {
  }

///

  setupOrganisation() {

    let createTitle = 'Create Organisation';
    if (COUNTER > 0) {
      createTitle += '- You will have to complete this in order to continue or jump back to the user dashboard';
    }

    let title = this.organisationStore.isReady ? 'Change Organisation' : createTitle;
    let item = {name: this.organisationStore.isReady ? this.organisationStore.name : ''};
    let acceptAction = ORGANISATION_ACTIONS.ACCEPT_CREATE_ORGANISATION;
    let cancelAction = ORGANISATION_ACTIONS.CANCEL_CREATE_ORGANISATION;

    let prompt = this.promptFactory.buildFormPrompt(title, item, acceptAction, cancelAction);
    prompt.promptModel.icon = 'organisation';

    this.promptService.openPrompt(prompt);
  }

  @handle(ORGANISATION_ACTIONS.ACCEPT_CREATE_ORGANISATION)
  handleAcceptCreateOrganisation(action, model) {

    let userInfo = this.organisationStore.userInfo;

    let organisation = {
      organisationRegistrationId: uuid.v4(),
      organisationName: model.item.name,
      creator: {
        passportId: this.userSession.loggedInUser.passportId,
        userId: this.userSession.loggedInUser.userId,
        personId: this.userSession.loggedInUser.personId,
        firstName: userInfo ? userInfo.firstName : '',
        surname: userInfo ? userInfo.surname : '',
        email: userInfo ? userInfo.emails[0] : ''
      }
    };

    this.organisationService.completeSetup(organisation);
  }

  @handle(ORGANISATION_ACTIONS.CANCEL_CREATE_ORGANISATION)
  handleCancelCreateOrganisation(action, model) {

    setTimeout(() => this.router.navigateBack(), 100);
  }

}
/*
*/
function addRouteMapMenuItems(routeMap, menuItems) {

  for (var menuItem of menuItems) {

    let route = menuItem.option.route;
    let name = route;
    let moduleId = `hud/dashboard/organisation/${route}/organisation.${route}`;
    let title = menuItem.name;
    //let showWings = menuItem.showWings;

    routeMap.push({route: route, name: name, moduleId: moduleId, nav: false, title: title});
  }
}
