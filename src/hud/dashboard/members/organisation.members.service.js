/*
*/
import {UserSession} from 'zailab.common';
/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from './organisation.members.actions';
import {UrlFactory} from '../../../_common/factories/url.factory';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {HttpClient} from 'aurelia-http-client';
/*
 */
const logger = LogManager.getLogger('OrganisationMembersService');
/*
*/

@inject(UrlFactory, Dispatcher, UserSession, HttpClient)
export class OrganisationMembersService {

  constructor(urlFactory, dispatcher, userSession, httpClient) {

    this.urlFactory = urlFactory;
    this.userSession = userSession;
    this.dispatcher = dispatcher;
    this.httpClient = httpClient;
  }
  
  retrieveMembers() {

    let organisationId = this.userSession.organisationId;
    let members = [];
    let uri = this.urlFactory.build(`member/displayOrganisationMembersView/${organisationId}`);

    this.httpClient.get(uri).then(
      (response) => {
        let members = resolveOrganisationMembersResponse(response);

        this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS, members);
      },
      (error) => {
        this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS, []);
      }
    );
  }
  
  hideWidgets() {
    
    this.dispatcher.dispatch('organisation.profile.select', false);
  }
}
/*
*/
function resolveOrganisationMembersResponse(response) {

  let members = [];

  if (response.members) {
    
    return response.members;
  }
}