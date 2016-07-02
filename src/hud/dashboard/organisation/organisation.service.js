/*
*/
import {ORGANISATION_ACTIONS} from './organisation.actions';
import {ORGANISATION_WIDGET_ACTIONS} from '../../_widgets/organisation/organisation.actions';
/*
*/
import {ApplicationService} from '../../../_common/services/application.service';
import {WebSocket} from '../../../_common/services/websocket';
import {UserSession} from '../../../_common/stores/user.session';
import {DatabaseService} from '../../../_common/services/database.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('OrganisationService');
/*
*/
@inject(ApplicationService, WebSocket, UserSession, DatabaseService, Dispatcher, EventAggregator)
export class OrganisationService {

  constructor(applicationService, webSocket, userSession, databaseService, dispatcher, eventAggregator) {

    this.applicationService = applicationService;
    this.webSocket = webSocket;
    this.userSession = userSession;
    this.databaseService = databaseService;
    this.dispatcher = dispatcher;
    this.eventAggregator = eventAggregator;
    this.registerEvents();
  }

  registerEvents() {
    let personId = this.userSession.loggedInUser.personId;
    this.databaseService.onUserAccessRoleAdded(personId, data => { 
      this.refreshToken();
    });    
  }

  retrieveUserInfo(personId) {
    this.applicationService.userInfoSearch(personId).then(
      response => {
        if (response.displayPersonInformationView && response.displayPersonInformationView[0]) {
          var userInfo = response.displayPersonInformationView[0];
          this.dispatcher.dispatch(ORGANISATION_ACTIONS.USER_INFO_RETRIEVED, userInfo);
        }
      },
      error => {
        this.dispatcher.dispatch(ORGANISATION_ACTIONS.USER_INFO_ERROR, error);
      }
    );
  }

  retrieveOrganisationInfo(organisationId) {
    this.applicationService.retrieveOrganisationInfoSearch(organisationId).then(
    response => {
      if (response.displayOrganisationView) {
        let organisationInfo = response.displayOrganisationView[0];
        this.dispatcher.dispatch(ORGANISATION_ACTIONS.RETRIEVE_ORGANISATION_INFO, organisationInfo);
        // this.dispatcher.dispatch(ORGANISATION_WIDGET_ACTIONS.CHANGE_ORGANISATION_NAME, organisationInfo.organisationName);
      }
    },
    error=> {}
    );
  }

  completeSetup(setup) {

    if (!setup.organisationName) {
      return;
    }

    let message = {
      feature: 'registration',
      name: 'com.zailab.user.organisationregistration.api.commands.RegisterOrganisationCommand',
      state: {
        organisationRegistrationId: setup.organisationRegistrationId,
        organisationName: setup.organisationName,
        creator: setup.creator
      }
    };
    this.webSocket.publish(message); // TMP solution
    this.userSession.accountActivated = false;
    this.dispatcher.dispatch(ORGANISATION_ACTIONS.COMPLETE_SETUP, setup);
    this.eventAggregator.publish(ORGANISATION_ACTIONS.UPDATE_ORGANISATION_WIDGET, setup.organisationName);
  }

  refreshToken() {
    this.applicationService.accountRefreshToken().then(
      response=> {
        this.eventAggregator.publish(ORGANISATION_ACTIONS.UPDATE_TOKEN, response);
      }
    );
  }

  completeAdmin(admin) {

    if (!admin.cos || admin.cos.length === 0 || isNoneSelected(admin.cos)) {
      return;
    }

    if (!admin.services || admin.services.length === 0 || isNoneSelected(admin.services)) {
      return;
    }

    if (!admin.sites || admin.sites.length === 0 || isNoneSelected(admin.sites)) {
      return;
    }

    this.dispatcher.dispatch(ORGANISATION_ACTIONS.COMPLETE_ADMIN, admin);
  }
}
/*
*/
function isNoneSelected(items) {

  for (let item of items) {

    if (item.isSelected) {
      return false;
    }
  }
  return true;
}
