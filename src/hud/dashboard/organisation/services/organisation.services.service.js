/*
*/
import {UserSession, ApplicationService, PromptFactory, PromptService} from 'zailab.framework';
/*
*/
import {ORGANISATION_SERVICES_ACTIONS, UniqueServiceValidationRule} from './organisation.services.context';
/*
*/
import {OrganisationServicesStore} from  './organisation.services.store';
import {WebSocket} from '../../../../_common/services/websocket';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationServicesService');
/*
*/
@inject(UserSession, ApplicationService, PromptFactory, PromptService, Dispatcher, EventAggregator, WebSocket, OrganisationServicesStore)
export class OrganisationServicesService {

  constructor(userSession, applicationService, promptFactory, promptService, dispatcher, eventAggregator, webSocket, organisationServicesStore) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
    this.eventAggregator = eventAggregator;
    this.dispatcher = dispatcher;
    this.webSocket  = webSocket;
    this.organisationServicesStore = organisationServicesStore;
    this.registerEvents();
  }

  registerEvents() {
    this.eventAggregator.subscribe('ValidationErrorsReceived', response => this.handleValidationErrors(response));
  }

  handleValidationErrors(response) {
    for (var i = 0; i < this.organisationServicesStore.services.length; i++) {
      if (this.organisationServicesStore.services[i].serviceId === response.state.entity.serviceId && response.state.objectName === 'deselectServiceCommand') {
        this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.ACTIVATE_SERVICE, this.organisationServicesStore.services[i]);
      }

    }
    if (response.state.objectName === 'removeServiceCommand') {

      let organisationId = response.state.entity.organisationId;
      let serviceId = response.state.entity.serviceId;
      let serviceName = response.state.entity.serviceName;
      let taskDataSLA = null;

      let service = {organisationId: organisationId,  serviceId: serviceId, serviceName: serviceName, taskDataSLA: taskDataSLA};
      this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.ADD_SERVICE, service);
      this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.ACTIVATE_SERVICE, service);
    }
  }

  retrieveServices() {

    this.applicationService.displayServicesSearch(this.userSession.organisationId)
      .then(
        (response) => {
          if (response.displayServicesView) {

            let services = response.displayServicesView[0].services;

            this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.RETRIEVE_SERVICES, services);
          } else {

            this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.RETRIEVE_SERVICES, []);
          }
        },
        (error) => {

          this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.RETRIEVE_SERVICES, []);
        }
      )
    ;
  }

  openAddServicePrompt(services) {

    let title = 'Add Service';
    let item = {id: uuid.v4(), serviceName: ''};
    let acceptAction = ORGANISATION_SERVICES_ACTIONS.ACCEPT_ADD_SERVICE;

    let option = this.promptFactory.buildFormPrompt(title, item, acceptAction);
    option.promptModel.icon = 'services';
    option.promptModel.rule = {
      serviceName: new UniqueServiceValidationRule(services)
    };

    this.promptService.openPrompt(option);
  }

  addService(service) {
    service.serviceId = service.id;

    let organisationId = this.userSession.organisationId;
    let serviceId = service.serviceId;
    let serviceName = service.serviceName;
    let taskDataSLA = null;

    this.applicationService.addService(organisationId, serviceId, serviceName, taskDataSLA);

    let serviceToAdd = {
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      organisationId: this.userSession.organisationId,
      taskDataSLA: null
    }
    
    this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.ADD_SERVICE, serviceToAdd);
  }

  activateService(service) {

    this.applicationService.selectService(this.userSession.organisationId, service.serviceId);

    this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.ACTIVATE_SERVICE, service);
  }

  deactivateService(service) {
    this.applicationService.deselectService(this.userSession.organisationId, service.serviceId);
    this.dispatcher.dispatch(ORGANISATION_SERVICES_ACTIONS.DEACTIVATE_SERVICE, service);
  }

  removeService(services) {
    for (var i = 0; i < services.length ; i++) {
      let organisationId = this.userSession.organisationId;

      let taskDataSLA = null;
      this.applicationService.removeService(organisationId, services[i].serviceId, services[i].serviceName, taskDataSLA);
    }
  }
}
