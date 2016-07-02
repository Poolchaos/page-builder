/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributesSiteService');
/*
*/

@inject(UserSession, ApplicationService, HttpClient)
export class OrganisationMembersAttributesSiteService {

  constructor(userSession, applicationService, httpClient) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.httpClient = httpClient;
  }

  changeMemberSite(memberId, siteId, siteName) {
    this.applicationService.allocateMemberToSite(memberId, siteId, siteName);
  }

}
