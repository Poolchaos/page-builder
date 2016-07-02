/*
*/
import {ORGANISATION_SERVICES_ACTIONS} from './organisation.services.context';
/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import toastr from 'toastr';
/*
*/
const logger = LogManager.getLogger('OrganisationServicesStore');
/*
*/
var errorMessage = '';
var serviceId = null;
var service = '';

let STATE = {

  services: []
};
/*
*/
export class OrganisationServicesStore {

  get services() {

    for (let service of STATE.services) {

      let serviceName = service.serviceName;
      let items = [serviceName];
      service.labelPosition = 'out';
      service.labelClassName = 'o-crud-list__icon o-crud-list__icon--service';
      service.isSelected = service.selected;
    }

    return STATE.services;
  }

  @handle(ORGANISATION_SERVICES_ACTIONS.RETRIEVE_SERVICES)
  handleRetrieveServices(action, services) {

    STATE.services = sortServices(services);
  }

  @handle(ORGANISATION_SERVICES_ACTIONS.ACTIVATE_SERVICE)
  handleActivateService(action, service) {

    service.selected = true;
  }

  @handle(ORGANISATION_SERVICES_ACTIONS.DEACTIVATE_SERVICE)
  handleDeactivateService(action, service) {

    service.selected = false;
  }

  @handle(ORGANISATION_SERVICES_ACTIONS.ADD_SERVICE)
  handleAcceptAddService(action, service) {

    STATE.services.push(service);
  }
}
/*
*/
function sortServices(services) {

  var tmpArr = [];

  for (var i = 0; i < services.length; i++) {

    tmpArr.push(services[i]);
  }

  tmpArr.sort(
    function(a, b) {

      return (a['serviceName'].toLowerCase() > b['serviceName'].toLowerCase()) ? 1 : ((b['serviceName'].toLowerCase() > a['serviceName'].toLowerCase()) ? -1 : 0);
    });

  return tmpArr;
}
