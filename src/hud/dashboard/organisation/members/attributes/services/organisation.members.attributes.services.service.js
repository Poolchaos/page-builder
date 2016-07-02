/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {inject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Dispatcher} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributesServicesService');
/*
*/

@inject(UserSession, ApplicationService, HttpClient, EventAggregator, Dispatcher)
export class OrganisationMembersAttributesServicesService {

  constructor(userSession, applicationService, httpClient, eventAggregator, dispatcher) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.httpClient = httpClient;
    this.eventAggregator = eventAggregator;
    this.dispatcher = dispatcher;
    this.registerEvents();
  }

  registerEvents() {
    this.eventAggregator.subscribe('ValidationErrorsReceived', response => this.handleValidationErrors(response));
  }

  handleValidationErrors(response) {
    if (response.state.objectName === 'deallocateServiceFromMemberCommand') {
      let service = {
        serviceName: response.state.entity.serviceName,
        serviceId: response.state.entity.serviceId,
      };
      this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.RECREATE_SERVICE, service);
    }
  }

  allocateMemberService(memberId, serviceId, serviceName) {
    this.applicationService.allocateServiceToMember(memberId, serviceId, serviceName);
  }

  deallocateMemberService(memberId, serviceId, serviceName) {
    this.applicationService.deallocateServiceFromMember(memberId, serviceId, serviceName);
  }
}
