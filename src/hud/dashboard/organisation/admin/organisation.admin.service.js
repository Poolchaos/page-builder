/*
zailab
*/
import {ORGANISATION_ADMIN_ACTIONS} from './organisation.admin.actions';
import {OrganisationSetupStore} from '../setup/organisation.setup.store'; // TODO - move to VM?
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationAdminService');

@inject(OrganisationSetupStore, Dispatcher)
export class OrganisationAdminService {

  constructor(organisationSetupStore, dispatcher) {

    this.organisationSetupStore = organisationSetupStore;
    this.dispatcher = dispatcher;
  }

  retrieveCos(existingCos) {

    let cos = [
      {id: '1', type: 'A', name: 'Type A'},
      {id: '2', type: 'B', name: 'Type B'},
      {id: '3', type: 'C', name: 'Type C'}
    ];

    if (existingCos) {
      for (let c of cos) {

        for (let existingC of existingCos) {

          if (c.id === existingC.id) {
            c.isSelected = existingC.isSelected;
          }
        }
      }
    }

    this.dispatcher.dispatch(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_COS, cos);
  }

  retrieveServices(existingServices) {

    let services = [];

    if (this.organisationSetupStore.services) {

      let setupServices = JSON.parse(JSON.stringify(this.organisationSetupStore.services));
      for (let service of setupServices) {
        if (service.isSelected) {
          services.push(service);
        }
      }

      for (let service of services) {
        service.isSelected = false;
      }
    }

    if (existingServices) {
      for (let service of services) {

        for (let existingService of existingServices) {

          if (service.id === existingService.id) {
            service.isSelected = existingService.isSelected;
          }
        }
      }
    }

    this.dispatcher.dispatch(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_SERVICES, services);
  }

  retrieveSites(existingSites) {

    let sites = [];

    if (this.organisationSetupStore.sites) {

      let setupSites = JSON.parse(JSON.stringify(this.organisationSetupStore.sites));
      for (let site of setupSites) {
        if (site.isSelected) {
          sites.push(site);
        }
      }

      for (let site of sites) {
        site.isSelected = false;
      }
    }

    if (existingSites) {
      for (let site of sites) {

        for (let existingSite of existingSites) {

          if (site.id === existingSite.id) {
            site.isSelected = existingSite.isSelected;
          }
        }
      }
    }

    this.dispatcher.dispatch(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_SITES, sites);
  }
}
