/*
*/
import {ORGANISATION_SERVICES_ACTIONS, OrganisationServicesService, OrganisationServicesStore} from './organisation.services.context';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationServices');
/*
*/
@inject(OrganisationServicesService, OrganisationServicesStore, Router)
export class OrganisationServices {

  settings = {
    add: {enabled: true},
    delete: {enabled: true},
		select: {enabled: true},
    edit: {enabled: true},
    labels: {enabled: true}
  };
  display = 'serviceName';
  options = {
    add: () => this.add(),
    change: (item) => this.change(item),
    remove: (items) => this.remove(items),
    compare: (service, searchText) => this.compare(service, searchText)
  }

  guide = 'This is a list of the services in your organisation. A service explains what type of work your organisation performs. This will help to match communication from your customers to the appropriate member.';
  
  resolve = null;

  constructor(organisationServicesService, organisationServicesStore, router) {

    this.organisationServicesService = organisationServicesService;
    this.organisationServicesStore = organisationServicesStore;

    this.router = router;
  }

  compare(service, searchText) {

    if (service.serviceName.toLowerCase().startsWith(searchText.toLowerCase())) {
      return true;
    }
    return false;
  }

  canActivate() {

    this.init();

    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.organisationServicesStore.services.length;
  }

  init() {
    this.organisationServicesService.retrieveServices();
  }

  add() {

    this.organisationServicesService.openAddServicePrompt(this.organisationServicesStore.services);
  }

  change(service) {

    if (service.isSelected) {
      this.organisationServicesService.deactivateService(service);
    } else {
      this.organisationServicesService.activateService(service);
    }
  }

  remove(services) {

    this.organisationServicesService.removeService(services);
  }

  @handle(ORGANISATION_SERVICES_ACTIONS.ACCEPT_ADD_SERVICE)
  handleAcceptAddService(action, model) {
    
    let service = model.item;

    this.organisationServicesService.addService(service);
  }

  @handle(ORGANISATION_SERVICES_ACTIONS.RETRIEVE_SERVICES)
  @waitFor(OrganisationServicesStore)
  handleRetrieveService() {

    if (this.resolve !== null) {
      this.resolve(true);
      this.resolve = null;
    }
  }
}
