import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {ORGANISATION_WIDGET_ACTIONS} from './organisation.actions';
import {UserSession} from '../../../_common/stores/user.session';
/*
*/
import {ApplicationService, DatabaseService} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('OrganisationWidgetService');

@inject(Dispatcher, ApplicationService, DatabaseService, UserSession)
export class OrganisationWidgetService {

  constructor(dispatcher, applicationService, databaseService, userSession) {

    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.databaseService = databaseService;
    this.userSession = userSession;
  }

  retrieveOrganisationInfo() {

    let organisationId = this.userSession.organisationId;

    this.applicationService.retrieveOrganisationInfoSearch(organisationId).then(
    response => {

      if (response.displayOrganisationView) {
        let organisationInfo = response.displayOrganisationView[0];
        this.dispatcher.dispatch(ORGANISATION_WIDGET_ACTIONS.RETRIEVE_ORGANISATION_INFO, organisationInfo);
      }
    });
  }

  updateOrganisationName(organisationName) {
    this.dispatcher.dispatch(ORGANISATION_WIDGET_ACTIONS.CHANGE_ORGANISATION_NAME, organisationName);
  }
  
  navigate() {

    this.dispatcher.dispatch('organisation.profile.select', false);
  }
}
