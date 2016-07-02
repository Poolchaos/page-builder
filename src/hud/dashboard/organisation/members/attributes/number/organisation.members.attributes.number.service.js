/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributesNumberService');
/*
*/

@inject(UserSession, ApplicationService, HttpClient)
export class OrganisationMembersAttributesNumberService {

  constructor(userSession, applicationService, httpClient) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.httpClient = httpClient;
  }

  changeMemberNumber(memberId, siteId, siteName) {
    this.applicationService.allocateMemberToSite(memberId, siteId, siteName);
  }

}
