/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributesRoleService');
/*
*/

@inject(UserSession, ApplicationService, Dispatcher)
export class OrganisationMembersAttributesRoleService {

  constructor(userSession, applicationService, dispatcher) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
  }

  changeMemberRole(memberId, roleToDeallocate, roleToAllocate) {

    this.applicationService.allocateRoleToMember(memberId, roleToAllocate);

    this.applicationService.onRoleAllocatedToMember(response=> {
      this.applicationService.deallocateRoleFromMember(memberId, roleToDeallocate);
    });
  }

  revertMemberRoleChange(previousRole) {
    
    this.dispatcher.dispatch(ORGANISATION_MEMBERS_ACTIONS.REVERT_MEMBER_ROLE_CHANGE, previousRole);
  }
}
