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

}