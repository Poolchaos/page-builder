/*
*/
import {UserSession} from 'zailab.common';
/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from './organisation.members.actions';
import {ApplicationService} from '../../../../_common/services/application.service';
import {DatabaseService} from '../../../../_common/services/database.service';
import {UrlFactory} from '../../../../_common/factories/url.factory';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {HttpClient} from 'aurelia-http-client';
/*
*/
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebSocket} from '../../../../_common/services/websocket';
/*
 */
const logger = LogManager.getLogger('OrganisationMembersService');
/*
*/

@inject(UrlFactory, ApplicationService, DatabaseService, Dispatcher, UserSession, HttpClient, WebSocket, EventAggregator)
export class OrganisationMembersService {

  constructor(urlFactory, applicationService, databaseService, dispatcher, userSession, httpClient, webSocket, eventAggregator) {

    this.urlFactory = urlFactory;
    this.applicationService = applicationService;
    this.databaseService = databaseService;
    this.userSession = userSession;
    this.dispatcher = dispatcher;
    this.httpClient = httpClient;
    this.webSocket = webSocket;
    this.eventAggregator = eventAggregator;
    this.registerEvents();
  }

  registerEvents() {
    this.eventAggregator.subscribe('ValidationErrorsReceived', response => this.handleValidationErrors(response));
  }

  handleValidationErrors(response) {
    if (response.state.objectName === 'removeMember') {
      let member = {
        memberId: response.state.entity.memberId,
        personId: response.state.entity.personId,
        firstName: response.state.entity.firstName,
        surname: response.state.entity.surname,
        roleName: response.state.entity.roleName,
        extension: response.state.entity.extension,
        email: response.state.entity.email
      };
      this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.ADD_MEMBER, member);
    }
  }

  retrieveMembers() {

    let organisationId = this.userSession.organisationId;
    let members = [];
    let uri = this.urlFactory.build(`member/displayOrganisationMembersView/${organisationId}`);

    this.httpClient.get(uri).then(
      (response) => {
        let members = resolveOrganisationMembersResponse(response);

        this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS, members);
      },
      (error) => {
        this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS, []);
      }
    );
  }

  changeMember(member) {
    this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER, member);
  }

  removeMembers(members) {
    for (let member of members) {
      this.applicationService.removeMember(member.memberId, member.personId, member.email, member.extension, member.firstName, member.surname, member.roleName);
    }
  }

  retrieveViewModel(memberId) {

    let organisationId = this.userSession.organisationId;
    let organisation = {
      roles: [],
      channels: [],
      cos: [],
      services: [],
      sites: []
    };

    let retrieveRoles;
    let retrieveChannels;
    let retrieveCos;
    let retrieveServices;
    let retrieveSites;
    let retrieveMemberAttributes;

    retrieveRoles = () => {

      this.applicationService.displayRolesSearch(organisationId).then(
        (response) => {

          organisation.roles = resolveRolesResponse(response);
          retrieveChannels();
        },
        (error) => {

          retrieveChannels();
        }
      );
    };

    retrieveChannels = () => {
      
      this.applicationService.displayOrganisationChannels(organisationId)
      .then((response) => {

        
        let channels = resolveChannelsResponse(response);
        
        organisation.channels = channels;
        retrieveCos();
      },
        (error) => {

        retrieveCos();
      });

    };

    retrieveCos = () => {

      this.applicationService.displayClassesOfServiceSearch(organisationId).then(
        (response) => {

          organisation.cos = resolveCosResponse(response);
          retrieveServices();
        },
        (error) => {

          retrieveServices();
        }
      );
    };

    retrieveServices = () => {

      this.applicationService.displayOrganisationSelectedServicesSearch(organisationId).then(
          (response) => {

            organisation.services = resolveServicesResponse(response);
            retrieveSites();
          },
        error=> {

          retrieveSites();
        }
      );
    };

    retrieveSites = () => {

      this.applicationService.displaySitesSearch(organisationId).then(
        (response) => {

          organisation.sites = resolveSitesResponse(response);
          retrieveMemberAttributes();
        },
        (error) => {

          retrieveMemberAttributes();
        }
      );
    };

    retrieveMemberAttributes = () => {

      let uri = this.urlFactory.build(`member/displayMemberView/${memberId}`);

      this.httpClient.get(uri).then(
      (response) => {
        if (response) {
          let attributes = {
            organisation: organisation,
            member: response
          };

          this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_ORGANISATION_ATTRIBUTES, attributes);
        }
      });
    };

    retrieveRoles();
  }

  selectRole(role) {
    this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.SELECT_MEMBER_ROLE, role);
  }

  saveEmails(emails) {

    this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.SAVE_MEMBER_EMAILS, emails);
  }

  completeMember() {

    this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.COMPLETE_MEMBER);
  }
}
/*
*/
function resolveOrganisationMembersResponse(response) {

  let members = [];

  if (response.members) {
    return response.members;
  }
}
/*
*/
function resolveRolesResponse(response) {

  let formattedRoles = [];

  if (response.displayRolesView) {

    let roles = response.displayRolesView[0].roles;

    for (let role of roles) {

      formattedRoles.push({
        name: role
      });
    }
  }

  return formattedRoles;
}
/*
*/
function resolveCosResponse(response) {

  let formattedClassesOfService = [];

  if (response.displayClassesOfServiceView) {

    let classesOfService = response.displayClassesOfServiceView[0].classesOfService;

    for (let cos of classesOfService) {

      formattedClassesOfService.push({
        name: cos
      });
    }
  }

  return formattedClassesOfService;
}
/*
*/
function resolveServicesResponse(response) {

  let services = [];

  if (response.displaySelectedServicesView) {
    services = response.displaySelectedServicesView[0].selectedServices;
  }

  return services;
}
/*
*/
function resolveSitesResponse(response) {

  let sites = [];

  if (response.displaySitesView) {
    sites = response.displaySitesView[0].sites;
  }

  return sites;
}
/*
*/
function resolveChannelsResponse(response) {

  let channels = [];

  if (response.displayChannelsView) {

    channels = response.displayChannelsView;
  }

  return channels;
}
