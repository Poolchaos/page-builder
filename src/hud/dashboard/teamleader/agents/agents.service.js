import {LogManager, inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {HttpClient} from 'aurelia-http-client';
/*
 */
import {ApplicationService, DatabaseService, UrlFactory} from 'zailab.common';
import {UserSession} from 'zailab.framework';
/*
 */
import {AGENTS_ACTIONS} from './agents.actions';
/*
 */
import {ApplicationProperties} from '../../../../_config/application.properties';
/*
 */
const logger = LogManager.getLogger('DashboardStore');
/*
 */
@inject(Dispatcher, ApplicationService, DatabaseService, UrlFactory, UserSession, HttpClient, ApplicationProperties)
export class AgentsService {

  constructor(dispatcher, applicationService, databaseService, urlFactory, userSession, httpClient, applicationProperties) {

    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.databaseService = databaseService;
    this.urlFactory = urlFactory;
    this.userSession = userSession;
    this.httpClient = httpClient;
    this.applicationProperties = applicationProperties;

    this.registerEvents();
  }

  registerEvents(){

    let organisationId = this.userSession.organisationId;//'99b82f28-d452-4b46-947a-1bfbbeb2f17a';
    this.databaseService.onTeamLeaderAgentUpdated(organisationId, response => {
      let memberId = this.userSession.memberId;
      response.memberId = memberId;
      this.dispatcher.dispatch(AGENTS_ACTIONS.RETRIEVE_AGENTS_SUCCESS, response);
    });
  }

  retrieveAgents() {

    let memberId = this.userSession.memberId;
    let organisationId = this.userSession.organisationId;

    this.applicationService.displayMemberTeamLeaderAgents(organisationId).then(
        response => {

          if (response.displayTeamLeaderAgentsView &&  response.displayTeamLeaderAgentsView[0]) {
            response.displayTeamLeaderAgentsView[0].memberId = memberId;
            this.dispatcher.dispatch(AGENTS_ACTIONS.RETRIEVE_AGENTS_SUCCESS, response.displayTeamLeaderAgentsView[0]);
          }else {

            this.dispatcher.dispatch(AGENTS_ACTIONS.RETRIEVE_AGENTS_SUCCESS, []);
          }
        }
    );
  }

  spyCall(callId){

    let host = this.applicationProperties.apiRouterEndpoint;
    let organisationId = this.userSession.organisationId;
    let memberId = this.userSession.memberId;
    let url = this.urlFactory.buildUrl(host, `snoop/${organisationId}/${memberId}/spy/${callId}`);
    this.httpClient.post(url).then(
        (response) => {
          logger.debug(response);
        },
        (error) => {
          logger.debug(error);
        }
    );

  }

  whisperCall(callId){

    let host = this.applicationProperties.apiRouterEndpoint;
    let organisationId = this.userSession.organisationId;
    let memberId = this.userSession.memberId;
    let url = this.urlFactory.buildUrl(host, `snoop/${organisationId}/${memberId}/whisper/${callId}`);

    this.httpClient.post(url).then(
        (response) => {
          logger.debug(response);
        },
        (error) => {
          logger.debug(error);
        }
    );
  }

}
