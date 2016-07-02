/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {OrganisationMembersAttributesCosService} from './organisation.members.attributes.cos.service';

OrganisationMembersAttributesCosService

const logger = LogManager.getLogger('OrganisationMembersAttributesCos');

@inject(OrganisationMembersStore, OrganisationMembersAttributesCosService)
export class OrganisationMembersAttributesCos {

  title = {
    icon: 'class-of-service',
    name: 'Class of service'
  };
  position = 'right';

  constructor(organisationMembersStore, organisationMembersAttributesCosService) {

    this.organisationMembersStore = organisationMembersStore;
    this.organisationMembersAttributesCosService = organisationMembersAttributesCosService
  }

  setLabel() {

    this.label = this.organisationMembersStore.member.cos || 'Class of Service';
  }

  activate() {
    
    this.setLabel();
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_COS)
  @waitFor(OrganisationMembersStore)
  handleChangeOrganisationName() {
    
    let memberId = this.organisationMembersStore.member.memberId;
    let classOfService = this.organisationMembersStore.member.cos;
    
    this.organisationMembersAttributesCosService.changeMemberCos(memberId, classOfService);
    
    this.setLabel();
  }
}
