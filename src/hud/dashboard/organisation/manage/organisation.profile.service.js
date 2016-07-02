/*
*/
import {ORGANISATION_PROFILE_ACTIONS} from './organisation.profile.actions';
/*
*/
import {HttpClient} from 'aurelia-http-client';
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {ApplicationService, UrlFactory, UserSession} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('OrganisationProfileService');
/*
*/
@inject(Dispatcher, ApplicationService, HttpClient, UrlFactory, UserSession, EventAggregator)
export class OrganisationProfileService {

  constructor(dispatcher, applicationService, httpClient, urlFactory, userSession, eventAggregator) {

    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.httpClient = httpClient;
    this.urlFactory = urlFactory;
    this.userSession = userSession;
    this.eventAggregator = eventAggregator;
  }

  retrieveOrganisationInfo() {

    let organisationId = this.userSession.organisationId;

    this.applicationService.retrieveOrganisationInfoSearch(organisationId).then(
    response => {

      if (response.displayOrganisationView) {
        let organisationInfo = response.displayOrganisationView[0];
        this.dispatcher.dispatch(ORGANISATION_PROFILE_ACTIONS.RETRIEVE_ORGANISATION_INFO, organisationInfo);
      }
    });
  }
  
  changeName(name) {
    
    let organisationId = this.userSession.organisationId;
    
    this.applicationService.changeOrganisationInformation(organisationId, name);
    this.eventAggregator.publish(ORGANISATION_PROFILE_ACTIONS.CHANGE_ORGANISATION_NAME, name);
  }

  updateProfilePicture(base64) {

    let organisationId = this.userSession.organisationId;
    this.httpClient.put(this.urlFactory.build('media/images/' + organisationId), base64);
    this.eventAggregator.publish(ORGANISATION_PROFILE_ACTIONS.CHANGE_ORGANISATION_PICTURE, name);
  }

}
