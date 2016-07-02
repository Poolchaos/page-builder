/*
*/
import {ORGANISATION_INVITATIONS_ACTIONS} from './organisation.invitations.actions';
import {OrganisationInvitationsDatabaseService} from './organisation.invitations.database.service';
/*
*/
import {UserSession, ApplicationService} from 'zailab.framework';
import {HttpClient} from 'aurelia-http-client';
/*
*/
import {WebSocket} from '../../../../_common/services/websocket';
import {UrlFactory} from '../../../../_common/factories/url.factory';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersService');
/*
*/
@inject(OrganisationInvitationsDatabaseService, UserSession, ApplicationService, HttpClient, WebSocket, UrlFactory, Dispatcher)
export class OrganisationInvitationsService {

  constructor(organisationInvitationsDatabaseService, userSession, applicationService, httpClient, webSocket, urlFactory, dispatcher) {

    this.organisationInvitationsDatabaseService = organisationInvitationsDatabaseService;
    this.userSession = userSession;
    this.applicationService = applicationService;
    this.httpClient = httpClient;
    this.webSocket = webSocket;
    this.urlFactory = urlFactory;
    this.dispatcher = dispatcher;
  }

  registerEvents() {

    let organisationId = this.userSession.organisationId;
    this.organisationInvitationsDatabaseService.onPendingInvitesUpdated(organisationId, response=> {
      this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.REPLACE_INVITES, response.invitations);
    });
  }

  deregisterEvents() {

//    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITES, []);

    this.organisationInvitationsDatabaseService.onPageClose(this.userSession.organisationId);
  }

  setCurrentStep(step) {

    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.SET_CURRENT_STEP, step);
  }

  retrievePendingInvitations() {

    let organisationId = this.userSession.organisationId;

    this.applicationService.displayPendingInvitationsSearch(organisationId).then(
      (response) => {
        if (response.pendingInvitationsView && response.pendingInvitationsView[0]) {
          let invitations = response.pendingInvitationsView[0].invitations;
          for (var index in invitations) {
            invitations[index].labelPosition = 'out';
            invitations[index].labelClassName = 'crud_item_icon gem-icon--email';
          }

          this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITES, invitations);
        } else {

          this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITES, []);
        }
      },(error) => {

        this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITES, []);
      }
    );
  }

    revokePendingInvitations(invites) {
      for (let invite of invites) {
        let message = {
          feature: 'registration',
          name: 'com.zailab.user.invitation.api.commands.RevokeInvitationCommand',
          state: {
            invitationId: invite.invitationId,
          }
        };
        this.webSocket.publish(message);
      }

    }

  retrieveRoles() {
    let organisationId = this.userSession.organisationId;
    this.applicationService.displayRolesSearch(organisationId).then(
      response=> {
        if (response.displayRolesView) {

          let roles = response.displayRolesView[0].roles;
          let formattedRoles = [];

          for (let role of roles) {

            if (role === 'Agent') {
              formattedRoles.push({
                name: role,
                isSelected: true
              });
            }else {
              formattedRoles.push({
                name: role
              });
            }
          }

          this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_ROLES, formattedRoles);
        }
      }
    );
  }

  retrieveSites() {

    let organisationId = this.userSession.organisationId;

    this.applicationService.displaySitesSearch(organisationId)
    .then(response => {

      if (response.displaySitesView) {
        let sites = response.displaySitesView[0].sites;
        for (let site of sites) {
          if (site.siteName === 'Home') {
            site.isSelected = true;
          }
        }
        this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_SITES, sites);
      }
    });
  }

  retrieveChannels() {
    let channels = [
      {name: 'Inbound Call', isSelected: true},
      {name: 'Outbound Call', isSelected: true}
    ];
    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_CHANNELS, channels);
  }

  retrieveServices() {

    let organisationId = this.userSession.organisationId;

    this.applicationService.displayServicesSearch(organisationId).then(
      response => {
        if (response.displayServicesView) {
          let services = response.displayServicesView[0].services;
          let selectedServices = [];

          for (let service of services) {
            if (service.selected) {

              if (service.serviceName === 'General') {
                service.isSelected = true;
              }

              selectedServices.push(service);
            }
          }
          this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_SERVICES, selectedServices);
        }
      },
    error=> {
    });
  }

  retrieveCos() {

    let organisationId = this.userSession.organisationId;
    this.applicationService.displayClassesOfServiceSearch(organisationId).then(
      response=> {

        if (response.displayClassesOfServiceView) {

          let classesOfService = response.displayClassesOfServiceView[0].classesOfService;
          let formattedClassesOfService = [];

          for (let cos of classesOfService) {

            if (cos === 'Local (Including Mobile)') {
              formattedClassesOfService.push({
                name: cos,
                isSelected: true
              });
            }else {
              formattedClassesOfService.push({
                name: cos
              });
            }
          }
          this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_COS, formattedClassesOfService);
        }
      }
    );

  }

  retrieveOrganisationMembers() {

    let organisationId = this.userSession.organisationId;

    let uri = this.urlFactory.build(`member/displayOrganisationMembersView/${organisationId}`);

    this.httpClient.get(uri).then(
    (response) => {
      if (response.members) {
        let members = response.members;
        this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_MEMBERS, members);
      } else {
        this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_MEMBERS, []);
      }
    });

  }

  selectRole(role) {
    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.SELECT_INVITATION_ROLE, role);
  }

  completeInvitation(invitationId, email, organisationName, site, skills, services, role, classOfService, channels, userEmail) {

    let organisationId = this.userSession.organisationId;
    let inviterEmail = this.userSession.user.email;
    let message = {
      feature: 'registration',
      name: 'com.zailab.user.invitation.api.commands.SendInvitationCommand',
      state: {
        inviterEmail: inviterEmail,
        invitationId: invitationId,
        email: email,
        organisationId: organisationId,
        organisationName: organisationName,
        site: site,
        skills: skills,
        services: services,
        role: role,
        classOfService: classOfService,
        channels: formatChannels(channels),
        inviter: userEmail
      }

    };
    this.webSocket.publish(message);
    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.INVITATION_COMPLETED, message.state);
    //this.applicationService.sendInvitation(invitationId, email, organisationId, organisationName, inviterEmail, siteId, role, classOfServiceId, channelIds);
  }

  retrieveInvitationAttributes() {

    let invitationAttributes = {
      cos: [],
      sites: [],
      services: [],
      channels: []
    };

    let retrieveCos;
    let retrieveSites;
    let retrieveServices;
    let retrieveChannels;

    let organisationId = this.userSession.organisationId;

    retrieveCos = () => {

      this.applicationService.displayClassesOfServiceSearch(organisationId).then(
        (response) => {

          invitationAttributes.cos = resolveCosResponse(response);
          retrieveSites();
        },
        (error) => {

          retrieveSites();
        }
      );
    };

    retrieveSites = () => {

      this.applicationService.displaySitesSearch(organisationId).then(
        (response) => {

          invitationAttributes.sites = resolveSitesResponse(response);
          retrieveServices();
        },
        (error) => {

          retrieveServices();
        }
      );
    };

    retrieveServices = () => {

      this.applicationService.displayServicesSearch(organisationId).then(
        (response) => {

          invitationAttributes.services = resolveServicesResponse(response);
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
        
        invitationAttributes.channels = channels;
        this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITATION_ATTRIBUTES, invitationAttributes);
      });
    };

    retrieveCos();
  }

  clearAttributes() {
    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.CLEAR_ATTRIBUTES);
  }

  setError(error) {
    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.SET_ERROR, error);
  }

  clearError() {
    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.CLEAR_ERROR, {});
  }

}

function formatChannels(channels) {
  let formattedChannels = [];
  for (let channel of channels) {
    formattedChannels.push(channel.name);
  }
  return formattedChannels;
}
/*
*/
function resolveCosResponse(response) {

  let formattedClassesOfService = [];

  if (response.displayClassesOfServiceView) {

    let classesOfService = response.displayClassesOfServiceView[0].classesOfService;

    for (let cos of classesOfService) {

      if (cos === 'Local (Including Mobile)') {
        formattedClassesOfService.push({
          name: cos,
          isSelected: true
        });
      } else {
        formattedClassesOfService.push({
          name: cos
        });
      }
    }
  }

  return formattedClassesOfService;
}
/*
*/
function resolveSitesResponse(response) {

  let sites = [];

  if (response.displaySitesView) {
    sites = response.displaySitesView[0].sites;
    for (let site of sites) {
      if (site.siteName === 'Home') {
        site.isSelected = true;
      }
    }
  }

  return sites;
}
/*
*/
function resolveServicesResponse(response) {

  let selectedServices = [];

  if (response.displayServicesView) {

    let services = response.displayServicesView[0].services;

    for (let service of services) {

      if (service.selected) {

        if (service.serviceName === 'General') { // whaddup here? please explain in comment
          service.isSelected = true;
        }

        selectedServices.push(service);
      }
    }
  }

  return selectedServices;
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