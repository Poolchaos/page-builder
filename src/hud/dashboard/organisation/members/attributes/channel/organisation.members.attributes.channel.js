/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
import {OrganisationMembersAttributesChannelService} from './organisation.members.attributes.channel.service';
import {UserSession} from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationMembersAttributesChannel');

@inject(OrganisationMembersStore, OrganisationMembersAttributesChannelService, UserSession)
export class OrganisationMembersAttributesChannel {

  title = 'channels';
  position = 'left';
  display = 'name';
  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: true},
    edit: {enabled: true}
  };

  constructor(organisationMembersStore, organisationMembersAttributesChannelService, userSession) {
    this.organisationMembersStore = organisationMembersStore;
    this.organisationMembersAttributesChannelService = organisationMembersAttributesChannelService;
    this.userSession = userSession;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_CHANNEL)
  @waitFor(OrganisationMembersStore)
  handleChangeMemberChannel(action, item) {
    let memberId = this.organisationMembersStore.member.memberId;
    let organisationId = this.userSession.organisationId;
    if (item.isSelected) {

      this.organisationMembersAttributesChannelService.allocateChannelToMember(memberId, item.name);
    } else {

      this.organisationMembersAttributesChannelService.deallocateChannelFromMember(memberId, organisationId, item.name);
    }
  }

}

function getSelectedItems(items) {

  let selectedItems = [];

  for (let item of items) {
    if (item.isSelected) {
      selectedItems.push(item);
    }
  }

  return selectedItems;
}

