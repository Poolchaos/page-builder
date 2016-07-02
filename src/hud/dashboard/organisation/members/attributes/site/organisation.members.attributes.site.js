/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
/*
*/
import {OrganisationMembersAttributesSiteService} from './organisation.members.attributes.site.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationMembersAttributesSite');

@inject(OrganisationMembersStore, OrganisationMembersAttributesSiteService)
export class OrganisationMembersAttributesSite {

  title = {
    icon: 'sites',
    name: 'Site'
  };
  position = 'left';

  constructor(organisationMembersStore, organisationMembersAttributesSiteService) {

    this.organisationMembersStore = organisationMembersStore;
    this.organisationMembersAttributesSiteService = organisationMembersAttributesSiteService;
  }

  setLabel() {
    
    if(this.organisationMembersStore.member && this.organisationMembersStore.member.site && this.organisationMembersStore.member.site.siteName) {
      
      this.label = this.organisationMembersStore.member.site.siteName;
    } else {
      
      this.label = 'No site selected';
    }
  }

  activate() {
    this.setLabel();
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SITE)
  @waitFor(OrganisationMembersStore)
  handleChangeMemberSite(action, model) {
    
    let memberId = this.organisationMembersStore.member.memberId;
    let siteId = this.organisationMembersStore.member.site.siteId;
    let siteName = this.organisationMembersStore.member.site.siteName;

    this.organisationMembersAttributesSiteService.changeMemberSite(memberId, siteId, siteName);
    this.setLabel();
  }
}
