/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
/*
*/
import {OrganisationMembersAttributesRoleService} from './organisation.members.attributes.role.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributesRole');
/*
*/
@inject(OrganisationMembersStore, OrganisationMembersAttributesRoleService, EventAggregator)
export class OrganisationMembersAttributesRole {

  title = {
    icon: 'roles',
    name: 'Role'
  };
  position = 'left';
  display = 'name';

  subscription = null;

  constructor(organisationMembersStore, organisationMembersAttributesRoleService, eventAggregator) {

    this.organisationMembersStore = organisationMembersStore;
    this.organisationMembersAttributesRoleService = organisationMembersAttributesRoleService;

    this.subscription = eventAggregator.subscribe('ValidationErrorsReceived', (event) => {

      if (event.state.objectName === 'AllocateRoleToMemberCommand') {

        this.organisationMembersAttributesRoleService.revertMemberRoleChange(this.organisationMembersStore.member.previousRole);
      }
    });
  }

  setLabel() {
    this.label = this.organisationMembersStore.member.role || 'Role';
  }

  activate() {

    this.setLabel();
  }

  deactivate() {

    this.subscription.dispose();
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_ROLE)
  @waitFor(OrganisationMembersStore)
  handleChangeOrganisationName() {

    let memberId = this.organisationMembersStore.member.memberId;
    let roleToDeallocate = this.organisationMembersStore.member.previousRole;
    let roleToAllocate = this.organisationMembersStore.member.role;

    this.organisationMembersAttributesRoleService.changeMemberRole(memberId, roleToDeallocate, roleToAllocate);

    this.setLabel();
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.REVERT_MEMBER_ROLE_CHANGE)
  @waitFor(OrganisationMembersStore)
  handleRevertMemberRoleChange() {

    this.setLabel();
  }
}
