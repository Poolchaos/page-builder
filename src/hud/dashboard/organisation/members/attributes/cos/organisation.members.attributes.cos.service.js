/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributesCosService');
/*
*/

@inject(UserSession, ApplicationService, HttpClient)
export class OrganisationMembersAttributesCosService {

  constructor(userSession, applicationService, httpClient) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.httpClient = httpClient;
  }

  changeMemberCos(memberId, classOfService) {
    this.applicationService.allocateClassOfServiceToMember(memberId, classOfService);
  }

}
