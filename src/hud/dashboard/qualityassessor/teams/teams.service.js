import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {TEAMS_ACTIONS} from './teams.actions';
import {HttpClient} from 'aurelia-http-client';
/*
*/
import {ApplicationService, UserSession, UrlFactory} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('TeamsService');
/*
*/
@inject(ApplicationService, Dispatcher, UserSession, HttpClient, UrlFactory)
export class TeamsService {

  constructor(applicationService, dispatcher, userSession, httpClient, urlFactory) {
    
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.httpClient = httpClient;
    this.urlFactory = urlFactory;
  }

  retrieveServices() {

    this.applicationService.displayServicesSearch(this.userSession.organisationId).then(
      response => {
        if (response.displayServicesView) {
          
          let services = response.displayServicesView[0].services;

          this.dispatcher.dispatch(TEAMS_ACTIONS.RETRIEVE_SERVICES, services);
          this.retrieveMembers(response.displayServicesView[0].services[0].serviceId);

        } else {

          this.dispatcher.dispatch(TEAMS_ACTIONS.RETRIEVE_SERVICES, []);
        }
      },
      error => {

        this.dispatcher.dispatch(TEAMS_ACTIONS.RETRIEVE_SERVICES, []);
      });
  }

  toggleServices() {

    this.dispatcher.dispatch(TEAMS_ACTIONS.TOGGLE_SERVICES);
  }

  changeService() {

    this.dispatcher.dispatch(TEAMS_ACTIONS.CHANGE_SERVICE);
  }

  retrieveMembers(serviceId) {

    let organisationId = this.userSession.organisationId;
    let uri = this.urlFactory.build(`member/displayOrganisationMembersView/${organisationId}/${serviceId}`);

    this.httpClient.get(uri).then(
        (response) => {
          this.dispatcher.dispatch(TEAMS_ACTIONS.RETRIEVE_MEMBERS, response);
        },
        (error) => {
          this.dispatcher.dispatch(TEAMS_ACTIONS.RETRIEVE_MEMBERS, []);
        }
    );
  }

	selectService(service){
		
		this.dispatcher.dispatch(TEAMS_ACTIONS.SELECT_SERVICE, service);
	}

}