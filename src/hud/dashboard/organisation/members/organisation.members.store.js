/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from './organisation.members.actions';
/*
*/
import {SortTools} from 'zailab.common';
/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
 */
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersStore');
/*
*/
let STATE = {

  organisation: null,
  members: [],

  channels: null,
  cos: null,
  services: [],
  sites: null,
  numbers: null,
  roles: null,
  groups: null,
  skills: null,

  member: {
    id: null,
    text: null,
    previousRole: null,
    role: null,
    channels: null,
    cos: {name: null},
    number: null,
    services: [],
    site: {name: null},
    emails: [],
    skills: []
  }
};
/*
*/
export class OrganisationMembersStore {

  get members() {

    return STATE.members;
  }

  get organisation() {
    return STATE.organisation;
  }

  get channels() {

    for (let channel of STATE.organisation.channels) {
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
          channel.clickable = false;
          break;
        case 'SMS':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-sms';
          break;
        default :
          break;
      }

      channel.labelClassName = labelClassName;
    }

    return STATE.organisation.channels;
  }

  get cos() {

    for (let cos of STATE.organisation.cos) {

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

    return STATE.organisation.cos;
  }

  get services() {
    for (let service of STATE.organisation.services) {
      service.labelClassName = 'o-crud-list__icon o-crud-list__icon--service';
      service.name = service.serviceName;
    }
    return STATE.organisation.services;
  }

  get sites() {
    
    for (let site of STATE.organisation.sites) {

      if (!site) {
        continue;
      }
      
      site.name = site.siteName;
      site.labelClassName = 'o-crud-list__icon o-crud-list__icon--sites';
    }

    return STATE.organisation.sites;
  }

  get groups() {
    return STATE.organisation.groups;
  }

  get skills() {
    return STATE.organisation.skills;
  }

  get member() {
    return STATE.member;
  }

  get roles() {
    for (let role of STATE.organisation.roles) {
      let roleName = role.name;
      let items = [roleName];
      role.text = items;
      role.labelClassName = 'o-crud-list__icon o-crud-list__icon--' + roleName.replace(/\s+/g, '-').toLowerCase();
    }
    return STATE.organisation.roles;
  }

  get numbers() {
    let numbers = [{number: STATE.member.telphoneNumber}];
    return numbers;
  }

  get memberChannels() {
    return STATE.member.channels;
  }

  get selectedSkills() {
    return this.member.skills;
  }

  get promptItems() {

  }

@handle(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS)
  handleRetrieveMembers(action, members) {

    members = members ? members : [];

    for (let member of members) {
      let memberFullName = member.firstName + ' ' + member.surname;
      let memberEmail = member.email;
      let memberRoleName = member.roleName;
      let memberExtension = member.extension;
      let items = [memberFullName, memberEmail, memberExtension, memberRoleName];

      member.text = items;
      member.labelPosition = 'out';
      member.labelClassName = ' ';
      member.pictureId = member.personId;
      member.defaultPicture = 'target/_assets/img/profile_pic-holder.png';

      member.badges = {};
      
      if(member.roleName) {
        member.badges.left = (member.roleName.toLowerCase()).replace(' ', '-');
      }
      
      if(member.status) {
        
        if(member.status === 'ON_CALL') {
          
          member.status = 'busy';
        }
        
        member.badges.right = (member.status.toLowerCase()).replace('_', '-');
      }
    }
    
    STATE.members = members;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_ORGANISATION_ATTRIBUTES)
  handleRetrieveOrganisationAttributes(action, attributes) {

    this.setOrganisationSelected(attributes.organisation.roles, [{name: attributes.member.roles[0]}], 'name'); // roles
    this.setOrganisationSelected(attributes.organisation.sites, attributes.member.site ? [attributes.member.site] : [], 'siteName'); // sites
    this.setOrganisationSelected(attributes.organisation.cos, [{name: attributes.member.classOfService}], 'name'); // cos
    this.setOrganisationSelected(attributes.organisation.services, attributes.member.services ? attributes.member.services : [], 'serviceName'); // services

    let channels = [];
    attributes.member.channels = attributes.member.channels ? attributes.member.channels : [];
    for (var channel of attributes.member.channels) {

      let labelClassName = null;
      switch (channel) {
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
          //channel.isDisabled = true;
            channel.clickable = false;
          break;
        case 'SMS':
          labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-sms';
          break;
        default :
          break;
      }

      channels.push({
        name: channel,
        isSelected: true,
        labelClassName: labelClassName
      });
    }
    attributes.member.channels = channels;
    
    for(var cc of attributes.organisation.channels) {
      
      cc.name = cc.channelName;
    }

    this.setOrganisationSelected(attributes.organisation.channels, channels, 'name'); // channels

    let member = attributes.member;
    member.role = attributes.member.roles[0];
    member.skillGroups = attributes.member.skillGroups ? attributes.member.skillGroups : [];

    let skills = [];
    for (var group of member.skillGroups) {

      for (var skill of group.skills) {
        skill.labelClassName = 'o-crud-list__icon o-crud-list__icon--skill';
        skill.isSelected = true;
        skill.skillGroupId = group.skillGroupId;
        skills.push(skill);
      }
    }

    skills.sort(SortTools.compareBy('skillName'));
    member.skills = skills;
    member.cos = attributes.member.classOfService;

    member.services = member.services ? member.services : [];
    for (var service of member.services) {
      service.labelClassName = 'o-crud-list__icon o-crud-list__icon--service';
      service.isSelected = true;
      service.name = service.serviceName;
    }
    let defaultService;
    let selectedServices = [];

    for (var service of attributes.organisation.services) {

      if (service.serviceName === 'General') {

        defaultService = service;
      } else {

        selectedServices.push(service);
      }
    }

    selectedServices.sort(SortTools.compareBy('serviceName'));

    if (defaultService) {
      selectedServices.unshift(defaultService);
    }

    attributes.organisation.services = selectedServices;

    let defaultSite;
    let selectedSites = [];

    for (var site of attributes.organisation.sites) {

      if(!site) {
        continue;
      }
      
      if (site.siteName === 'Home') {

        defaultSite = site;
      } else {

        selectedSites.push(site);
      }
    }

    selectedSites.sort(SortTools.compareBy('siteName'));

    if (defaultSite) {
      selectedSites.unshift(defaultSite);
    }

    attributes.organisation.sites = selectedSites;

    attributes.member.skills = member.skills;

    //sort member data
    attributes.member.channels.sort(SortTools.compareBy('name'));
    //    attributes.member.roles.sort();
    attributes.member.services.sort(SortTools.compareBy('serviceName'));
    attributes.member.skills.sort(SortTools.compareBy('skillName'));

    STATE.organisation = attributes.organisation;
    STATE.member = attributes.member;
  }

  setOrganisationSelected(listToUpdate, listToCompare, keyToCompare) {

    if (!listToCompare) {

      return;
    }

    for (var item of listToUpdate) {

      if (!item[keyToCompare]) {
        continue;
      }

      for (var item2 of listToCompare) {

        if (!item2[keyToCompare]) {
          continue;
        }

        if (item[keyToCompare] === item2[keyToCompare]) {

          item.isSelected = true;
        }
      }
    }

  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.SELECT_MEMBER_ROLE)
  handleSelectMemberRole(action, role) {
    STATE.member.role = role;

  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SKILLS)
  handleChangeMemberSkills(action, changedSkill) {
    if (changedSkill.isSelected) {

      STATE.member.skills.push({
        labelClassName: 'o-crud-list__icon o-crud-list__icon--skill',
        isSelected: true,
        proficiency: 0,
        skillGroupId: changedSkill.groupId,
        skillId: changedSkill.id,
        skillName: changedSkill.name
      });

      STATE.member.skills.sort(SortTools.compareBy('skillName'));

      return;
    }

    let length = STATE.member.skills.length;
    for (let i = 0; i < length; i++) {

      let skill = STATE.member.skills[i];
      if (skill.skillId === changedSkill.id) {

        STATE.member.skills.splice(i, 1);
        break;
      }
    }

    //skills.sort(SortTools.compareBy('name'))
    //    STATE.member.skills = skills;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_CHANNEL)
  handleChangeMemberChannel(action, item) {
    let labelClassName = null;
    switch (item.name) {
      case 'Inbound Call':
        labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-incoming';
        break;
      case 'Outbound Call':
        labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-outgoing';
        break;
      case 'Kiosk Call':
        labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-kiosk';
        break;
      case 'SMS':
        labelClassName = 'o-prompt-list__icon o-prompt-list__icon--channel-sms';
        break;
      default :
        break;
    }

    if (item.isSelected) {

      item.labelClassName = labelClassName;
      STATE.member.channels.push(item);
    } else {

      let length = STATE.member.channels.length;
      for (let i = 0; i < length; i++) {

        let channel = STATE.member.channels[i];

        if (channel.name === item.name) {

          STATE.member.channels.splice(i, 1);
          break;
        }
      }
    }

    STATE.member.channels.sort(SortTools.compareBy('name'));
    //    let selectedChannels = getSelectedItems(model.items);
    //    STATE.member.services.sort(SortTools.compareBy('name'));
    //    STATE.member.channels = selectedChannels;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_COS)
  handleChangeMemberCos(action, model) {
    let selectedCos = getSelectedItem(model.items);
    STATE.member.cos = selectedCos.name;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SERVICES)
  handleChangeMemberService(action, item) {
    if (item.isSelected) {

      item.labelClassName = 'o-crud-list__icon o-crud-list__icon--service';
      STATE.member.services.push(item);
      STATE.member.services.sort(SortTools.compareBy('serviceName'));

    //      let canAdd = true;
    //
    //      for (let service of STATE.member.services) {
    //        if (service.serviceName === item.serviceName) {
    //          canAdd = false;
    //          break;
    //        }
    //      }

    //      if (canAdd) {
    //        STATE.member.services.push(item);
    //        STATE.member.services.sort(SortTools.compareBy('serviceName'));
    //      }
    } else {

      let length = STATE.member.services.length;
      for (let i = 0; i < length; i++) {

        let service = STATE.member.services[i];
        if (service.serviceId === item.serviceId) {

          STATE.member.services.splice(i, 1);
          break;
        }
      }
    }
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SITE)
  handleChangeMemberSite(action, model) {
    let selectedSite = getSelectedItem(model.items);
    STATE.member.site = selectedSite;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_ROLE)
  handleChangeMemberRole(action, model) {
    STATE.member.previousRole = STATE.member.role;
    STATE.member.role = getSelectedItem(model.items).name;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_NUMBER)
  handleChangeMemberNumber(action, model) {
    STATE.member.number = getSelectedItem(model.items).number;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_EMAIL)
  handleChangeMemberEmail(action, model) {

    let address = model.item.address;
    let text = addressText(address);

    STATE.member.emails = STATE.member.emails ? STATE.member.emails : [];
    for (let email of STATE.member.emails) {

      if (email.id === model.item.id) {

        email.address = address;
        email.text = text;
        break;
      }
    }
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.COMPLETE_MEMBER)
  handleCompleteMember() {

    let member = JSON.parse(JSON.stringify(STATE.member));

    STATE.member = {
      id: null,
      role: {name: null},
      channel: {name: null},
      cos: {name: null},
      service: {name: null},
      site: {name: null},
      emails: [],
      number: null
    };

    if (STATE.members === null) {
      STATE.members = [];
    }

    if (member.id === null) {

      member.id = uuid.v4();
      STATE.members.push(member);
    }

  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER)
  handleChangeMember(action, member) {

    for (var prop in member) {

      STATE.member[prop] = member[prop];
    }

    //    STATE.member = member;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.ADD_MEMBER)
  handleAddMember(action, member) {
    let memberFullName = member.firstName + ' ' + member.surname;
    let memberEmail = member.email;
    let memberRoleName = member.roleName;
    let memberExtension = member.extension;

    let items = [memberFullName, memberEmail, memberExtension, memberRoleName];

    member.text = items;

    STATE.members.push(member);
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.REVERT_MEMBER_ROLE_CHANGE)
  handleRevertMemberRoleChange(action, previousRole) {

    STATE.member.role = previousRole;

    for (let role of STATE.organisation.roles) {

      role.isSelected = false;

      if (role.name === STATE.member.role) {
        role.isSelected = true;
      }
    }
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.RECREATE_SERVICE)
  handleRecreateMemberService(action, service) {
    let recreatedService = {
      labelClassName: 'o-crud-list__icon o-crud-list__icon--service',
      serviceName: service.serviceName,
      serviceId: service.serviceId,
    };

    for (let s of STATE.organisation.services) {
      if (s.name === service.serviceName) {
        s.isSelected = true;

      }
    }

    if (STATE.member.services.length === 0) {
      STATE.member.services.push(recreatedService);
    }
  }
}
/*
*/
function addressText(address) {

  let text = address.substring(0, address.indexOf('@'));
  text += ' ' + address.substring(address.indexOf('@'), address.indexOf('@') + address.substring(address.indexOf('@')).indexOf('.'));
  text += ' ' + address.substring(address.indexOf('@')).substring(address.substring(address.indexOf('@')).indexOf('.'));

  return text;
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

