/*
*/
import {UserSession, ApplicationService} from 'zailab.framework';
/*
*/
import {ORGANISATION_KIOSKS_ACTIONS} from './organisation.kiosks.actions';
import {OrganisationKiosksDatabaseService} from './organisation.kiosks.database.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('OrganisationKiosksService');
/*
*/
import uuid from 'node-uuid';
/*
*/

@inject(OrganisationKiosksDatabaseService, Dispatcher, ApplicationService, UserSession)
export class OrganisationKiosksService {
  
  organisationId;

  constructor(organisationKiosksDatabaseService, dispatcher, applicationService, userSession) {

    this.organisationKiosksDatabaseService = organisationKiosksDatabaseService;
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
  }

  retrieveKiosks() {

    this.organisationId = this.userSession.organisationId;

    if(this.organisationId) {

      this.organisationKiosksDatabaseService.onPageClose(this.organisationId);
    }

    this.organisationKiosksDatabaseService.onKiosksUpdated(this.organisationId, data => {

      this.dispatcher.dispatch(ORGANISATION_KIOSKS_ACTIONS.RETRIEVE_KIOSKS, data.kiosks);
    });

    this.applicationService.displayOrganisationKioskKiosks(this.organisationId)
      .then(response => {

        let kiosks = resolveResponse(response);

        this.dispatcher.dispatch(ORGANISATION_KIOSKS_ACTIONS.RETRIEVE_KIOSKS, kiosks);

      });
  }

}
/*
 */
function resolveResponse(response) {

  let kiosks = [];

  if (response.displayKiosksView) {
    kiosks = response.displayKiosksView[0].kiosks;
  }

  return kiosks;
}