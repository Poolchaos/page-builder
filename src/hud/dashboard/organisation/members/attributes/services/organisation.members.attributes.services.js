/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
import {OrganisationMembersAttributesServicesService} from './organisation.members.attributes.services.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {UserSession} from 'zailab.common';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationMembersAttributesServices');

@inject(OrganisationMembersStore, OrganisationMembersAttributesServicesService, UserSession)
export class OrganisationMembersAttributesServices {

  title = 'services';
  position = 'left';
  display = 'serviceName';
  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: true},
    edit: {enabled: false}
  };

  constructor(organisationMembersStore, organisationMembersAttributesServicesService, userSession) {
    this.organisationMembersStore = organisationMembersStore;
    this.organisationMembersAttributesServicesService = organisationMembersAttributesServicesService;
    this.userSession = userSession;
  }

  activate() {
    this.setTitle();
  }

  setTitle() {
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SERVICES)
  @waitFor(OrganisationMembersStore)
  handleChangeMemberService(action, item) {
    let memberId = this.organisationMembersStore.member.memberId;
    if (item.isSelected) {

      this.organisationMembersAttributesServicesService.allocateMemberService(memberId, item.serviceId, item.serviceName);
    } else {

      this.organisationMembersAttributesServicesService.deallocateMemberService(memberId, item.serviceId, item.serviceName);
    }
  }

}
