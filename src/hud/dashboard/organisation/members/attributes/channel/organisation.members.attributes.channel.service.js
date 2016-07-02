/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributesChannelService');
/*
*/

@inject(UserSession, ApplicationService, HttpClient)
export class OrganisationMembersAttributesChannelService {

  constructor(userSession, applicationService, httpClient) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.httpClient = httpClient;
  }
  
  allocateChannelToMember(memberId, channelName) {
    this.applicationService.allocateChannelToMember(memberId, channelName);
  }
  
  deallocateChannelFromMember(memberId, organisationId, channelName) { 
    this.applicationService.deallocateChannelFromMember(memberId, organisationId, channelName);
  }
}
