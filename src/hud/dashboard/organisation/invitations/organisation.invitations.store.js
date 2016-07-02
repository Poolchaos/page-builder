/*
 */
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
 */
const logger = LogManager.getLogger('OrganisationInvitationsStore');
/*
 */
import {SortTools} from 'zailab.common';
/*
 */
import {ORGANISATION_INVITATIONS_ACTIONS} from './organisation.invitations.actions';
/*
 */
let STATE = {

  attributes: null,

  invitation: defaultInvitationProperties(),

  invitations: [],
  roles: [],
  sites: [],
  services: [],
  skillGroups: [],
  skills: [],
  cos: [],
  channels: [],
  members: [],
  previousDomain: null,
  error: '',

  isInviteCompleted: false,

  steps: [{
    icon: 'target/_assets/img/icon_roles.png',
    label: 'ROLE',
    description: 'Select a role',
    route: 'role'
  },{
    icon: 'target/_assets/img/icon_attributes.png',
    label: 'ATTRIBUTES',
    description: 'Define attributes',
    route: 'attributes'
  },{
    icon: 'target/_assets/img/icon_email-solid.png',
    label: 'EMAILS',
    description: 'Add emails',
    route: 'emails'
  }]
};
/*
 */
export class OrganisationInvitationsStore {

  get steps() {

    return STATE.steps;
  }

  get isInvitesEmpty() {

    return STATE.isInviteCompleted === false;
  }

  get isEmpty() {

    return STATE.attributes === null;
  }

  get invitationsCount() {

    return STATE.inviteCount;
  }

  get previousDomain() {

    return STATE.previousDomain;
  }

  get invitations() {

    for (let invite of STATE.invitations) {

      let email = invite.email;
      let role = invite.role;
      //let date = '2016/01/01';

      let items = [email, role];
      invite.text = items;
      invite.isSelected = false;
      invite.labelPosition = 'out';
      invite.labelClassName = 'o-crud-list__icon--' + role.replace(/\s+/g, '-').toLowerCase();
    }
    return STATE.invitations;
  }

  get cos() {

    for (let cos of STATE.attributes.cos) {

      let labelClassName = null;
      switch (cos.name) {
        case 'Internal Calls (Free)':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--cos-internal-calls-free';
          break;
        case 'Local (Excluding mobile)':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--cos-local-excluding-mobile';
          break;
        case 'Local (Including Mobile)':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--cos-local-including-mobile';
          break;
        case 'Local and International':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--cos-local-and-international';
          break;
        default :
          break;
      }

      cos.labelClassName = labelClassName;
    }

    return STATE.attributes.cos;
  }

  get error() {
    return STATE.error;
  }

  get skillGroups() {
    return STATE.skillGroups;
  }

  get skills() {
    return STATE.skills;
  }

  get channels() {

    let channels = [];

    for (let channel of STATE.attributes.channels) {

      if(STATE.invitation.role !== 'Agent' && channel.name === 'Kiosk Call') {

        continue;
      }

      let labelClassName = null;
      switch (channel.name) {
        case 'Inbound Call':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-incoming';
          break;
        case 'Outbound Call':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-outgoing';
          break;
        case 'Kiosk Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-kiosk';
          break;
        case 'Website Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-website';
          channel.isDisabled = true;
          break;
        case 'SMS':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-sms';
          break;
        default :
          break;
      }

      channel.labelClassName = labelClassName;
      channels.push(channel);
    }

    return channels;
  }

  get invitation() {
    return STATE.invitation;
  }

  get members() {
    return STATE.members;
  }

  get sites() {

    let sites = STATE.attributes.sites;
    for (let site of sites) {
      site.name = site.siteName;
      site.labelClassName = 'o-crud-list__icon o-crud-list__icon--sites';
    }
    return sites;
  }

  get roles() {
    for (let role of STATE.roles) {
      let roleName = role.name;
      let items = [roleName];
      role.text = items;
      role.labelPosition = 'out';
      role.labelClassName = 'o-crud-list__icon--' + roleName.replace(/\s+/g, '-').toLowerCase();
    }
    return STATE.roles;
  }

  get services() {

    let services = STATE.attributes.services;
    //    let services = STATE.services;

    for (let service of services) {
      service.labelClassName = 'o-crud-list__icon o-crud-list__icon--service';
      service.name = service.serviceName;
    }
    return services;
  }

  get emails() {

    for (let email of STATE.invitation.emails) {
      let address = email.address;
      let selectedRole = STATE.invitation.role;
      let items = [address, selectedRole];
      email.text = items;
      email.labelPosition = 'out',
          email.labelClassName = 'o-crud-list__icon--invitations';
    }
    return STATE.invitation.emails;
  }

  get selectedSkills() {
    return this.invitation.skills ? this.invitation.skills : [];
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITATION_ATTRIBUTES)
  handleRetrieveInvitationAttributes(action, invitationAttributes) {

    STATE.attributes = invitationAttributes;

    // TODO clean the store and remove unused state properties

    STATE.invitation.classOfService =  getSelectedItem(this.cos).name;

    let selectedSite = getSelectedItem(this.sites);
    STATE.invitation.site = {
      id: selectedSite ? selectedSite.siteId : '',
      name: selectedSite ? selectedSite.siteName : ''
    };

    STATE.invitation.services = [];

    for (let service of this.services) {
      if (service.serviceName === 'General') {
        STATE.invitation.services = [{
          id: service.serviceId,
          name: service.serviceName,
          labelClassName: 'o-crud-list__icon o-crud-list__icon--service'
        }];
        break;
      }
    }


    for (let channel of STATE.attributes.channels) {

      channel.name = channel.channelName;

      let disabled = false;

      let labelClassName = null;
      switch (channel.name) {
        case 'Inbound Call':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-incoming';
          channel.isSelected = true;
          break;
        case 'Outbound Call':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-outgoing';
          channel.isSelected = true;
          break;
        case 'Kiosk Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-kiosk';
          break;
        case 'Website Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-website';
          channel.isDisabled = true;
          break;
        case 'SMS':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-sms';
          break;
        default :
          break;
      }

      if (channel.isSelected) {
        STATE.invitation.channels.push({
          name: channel.name,
          labelClassName: labelClassName
        });
      }
    }
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.SELECT_INVITATION_ROLE)
  handleSelectInvitationRole(action, role) {
    role.isSelected = true;
    STATE.invitation.role = role.name;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.SET_CURRENT_STEP)
  handleSetCurrentStep(action, step) {

    let activeStepIndex;
    for (let stepIndex = 0; stepIndex < STATE.steps.length; stepIndex++) {

      STATE.steps[stepIndex].active = false;

      if (STATE.steps[stepIndex].route === step) {
        activeStepIndex = stepIndex;
        STATE.steps[stepIndex].active = true;
      }

      if (!activeStepIndex && activeStepIndex !== 0 || (activeStepIndex && stepIndex < activeStepIndex)) {
        STATE.steps[stepIndex].completed = true;
      } else {
        STATE.steps[stepIndex].completed = false;
      }

    }

  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SITE)
  handleChangeMemberSite(action, model) {
    STATE.invitation.site = getSelectedItem(model.items);
    STATE.error = '';
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_COS)
  handleChangeMemberCos(action, model) {
    STATE.invitation.classOfService = getSelectedItem(model.items).name;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_ROLES)
  handleRetrieveRoles(action, roles) {

    if (STATE.invitation && STATE.invitation.role) {

      for (var role of roles) {

        role.isSelected = false;
        if (role.name === STATE.invitation.role) {

          role.isSelected = true;
        }
      }
    }
    STATE.roles = roles;
    STATE.error = null;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_SERVICES)
  handleRetrieveServices(action, services) {

    STATE.invitation.services = [];

    for (let service of services) {
      if (service.serviceName === 'General') {
        STATE.invitation.services = [{
          id: service.serviceId,
          name: service.serviceName,
          labelClassName: 'o-crud-list__icon o-crud-list__icon--service'
        }];
      }
    }

    STATE.services = services;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_SITES)
  handleRetrieveSites(action, sites) {
    let selectedSite = getSelectedItem(sites);
    STATE.error = null;
    STATE.sites = sites;
    STATE.invitation.site = {
      id: selectedSite ? selectedSite.siteId : '',
      name: selectedSite ? selectedSite.siteName : ''
    };
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_COS)
  handleRetrieveCos(action, classesOfService) {
    STATE.invitation.classOfService =  getSelectedItem(classesOfService).name;
    STATE.cos = classesOfService;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITES)
  handleRetrieveInvites(action, invitations) {
    STATE.invitations = invitations;

    STATE.isInviteCompleted = false;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.REPLACE_INVITES)
  handleReplaceInvites(action, invitations) {

    STATE.invitations = [];
    for (let invite of invitations) {
      invite.text = [invite.email, invite.role];
      invite.labelClassName = 'o-crud-list__icon--' + invite.role.replace(/\s+/g, '-').toLowerCase();
      STATE.invitations.push(invite);
    }

    STATE.isInviteCompleted = false;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_CHANNELS)
  handleRetrieveChannels(action, channels) {
    STATE.channels = channels;
    for (let channel of channels) {

      let labelClassName = null;
      switch (channel.name) {
        case 'Inbound Call':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-incoming';
          break;
        case 'Outbound Call':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-outgoing';
          break;
        default :
          break;
      }

      let formattedChannel = {
        name: channel.name,
        labelClassName: labelClassName
      };
      if (channel.isSelected) {
        STATE.invitation.channels.push(formattedChannel);
      }
    }
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.ADD_INVITATION_EMAIL)
  handleAddInvitationsEmail(action, payload) {


    STATE.previousDomain = payload.item._email_domain_;

    STATE.invitation.emails.push({
      address: payload.item.email,
      text: [payload.item.email, STATE.invitation.role]
    });

    //    if(payload.acceptAction.email.length === 0) {
    //      return;
    //    }
    //
    //    let address = payload.acceptAction.email;
    //    let domain = payload.acceptAction.domain;
    //
    //    let email = {
    //      address: (address + '@' + domain).toLowerCase()
    //    };
    //
    //    let selectedRole = STATE.invitation.role;
    //    let items = [domain, selectedRole];
    //    email.text = items;
    //
    //    STATE.invitation.emails.push(email);
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SERVICE)
  handleChangeService(action, payload) {

    if (payload.isSelected) {

      STATE.invitation.services.push({
        id: payload.serviceId,
        name: payload.serviceName,
        labelClassName: 'o-crud-list__icon o-crud-list__icon--service'
      });

      STATE.invitation.services.sort(SortTools.compareBy('name'));

      return;
    }

    let length = STATE.invitation.services.length;
    for (let i = 0; i < length; i++) {

      let service = STATE.invitation.services[i];

      if (service.id === payload.serviceId) {

        STATE.invitation.services.splice(i, 1);

        break;
      }
    }
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SITE)
  handleChangeSite(action, payload) {
    let selectedSite = getSelectedItem(payload.items);
    STATE.invitation.site = {
      id: selectedSite ? selectedSite.siteId : '',
      name: selectedSite ? selectedSite.siteName : ''
    };
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_CHANNEL)
  handleChangeChannels(action, payload) {
    //STATE.invitation.channels = payload.name;
    if(payload.channelName === 'Website Call'){
      payload.clickable = false;
      payload.isSelected = false;
    }

    if (payload.isSelected) {

      let labelClassName = null;
      switch (payload.name) {
        case 'Inbound Call':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-incoming';
          break;
        case 'Outbound Call':
          labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-outgoing';
          break;
        case 'Kiosk Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-kiosk';
          break;
        case 'Website Call':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-website';
          break;
        case 'SMS':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-sms';
          break;
        default :
          break;
      }

      STATE.invitation.channels.push({
        name: payload.name,
        labelClassName: labelClassName
      });

      STATE.invitation.channels.sort(SortTools.compareBy('name'));

      return;
    }
    let length = STATE.invitation.channels.length;
    for (let i = 0; i < length; i++) {

      let channel = STATE.invitation.channels[i];

      if (channel.name === payload.name) {

        STATE.invitation.channels.splice(i, 1);

        break;
      }
    }

  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SKILL)
  handleChangeSkill(action, changedSkill) {

    if (changedSkill.isSelected) {

      STATE.invitation.skills.push({
        skillGroupId: changedSkill.groupId,
        skillId: changedSkill.id,
        skillName: changedSkill.name,
        labelClassName: 'o-crud-list__icon o-crud-list__icon--skill'
      });

      STATE.invitation.skills.sort(SortTools.compareBy('skillName'));

      return;
    }

    let length = STATE.invitation.skills.length;
    for (let i = 0; i < length; i++) {

      let skill = STATE.invitation.skills[i];

      if (skill.skillId === changedSkill.id) {

        STATE.invitation.skills.splice(i, 1);

        break;
      }
    }
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.INVITATION_COMPLETED)
  handleInvitationCompleted(action, invitation) {

    let email = invitation.email;
    let role = invitation.role;
    let items = [email, role];
    invitation.labelClassName = 'o-crud-list__icon--' + role.replace(/\s+/g, '-').toLowerCase();
    invitation.text = items;

    STATE.invitations.push(invitation);
    STATE.error = null;

    STATE.isInviteCompleted = true;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.INVITATIONS_SENT)
  handleInvitationsSent(action) {

    STATE.inviteCount = this.invitation.emails.length;

    STATE.invitation = defaultInvitationProperties();
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_MEMBERS)
  handleRetrieveMembers(action, members) {
    STATE.members = members;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CLEAR_ATTRIBUTES)
  handleClearAttributes(action, members) {

    STATE.attributes = null;

    STATE.sites = [];
    STATE.services = [];
    STATE.skills = [];
    STATE.cos = [];
    STATE.channels = [];
    STATE.invitation = defaultInvitationProperties();
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.SET_ERROR)
  handleSetError(action, error) {
    STATE.error = error;
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CLEAR_ERROR)
  handleClearError(action, error) {
    STATE.error = null;
  }

}
/*
 */
function getSelectedItem(items) {

  for (let item of items) {
    if (item.isSelected) {
      return item;
    }
  }
}
/*
 */
function defaultInvitationProperties() {

  return {
    emails: [],
    services: [],
    skills: [],
    channels: [],
    site: {
      id: '',
      name: ''
    },
    role: 'Agent',
    classOfService: ''
  };
}
/*
 */

