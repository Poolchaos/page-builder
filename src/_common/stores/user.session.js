import {inject} from 'aurelia-framework';
import {LogManager} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

const logger = LogManager.getLogger('UserSession');

@inject(EventAggregator)
export class UserSession {

  key = 'zai_user';
  user;
  retrieveUsernameCallback;

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.init();
    this.accountActivated = true;
  }

  init() {
    //    this.eventAggregator.subscribe('logout', () => this.handleLogout()); // this is now called directly from AuthStep in app.js
    this.checkUserSession();
  }

  get isLoggedIn() {
    return this.user ? (this.user.token ? true : false) : false;
  }

  set loggedInUser(details) {

    sessionStorage.setItem(this.key, JSON.stringify(details));

    this.user = details;

    logger.debug('User session updated = ' + JSON.stringify(this.user));

    if (this.retrieveUsernameCallback && this.user) {
      this.retrieveUsernameCallback(this.user.email);
    }
  }

  get loggedInUser() {
    return this.user;
  }

  checkUserSession() {

    var userSession = JSON.parse(sessionStorage.getItem(this.key));

    this.user = userSession ? userSession : {};

    logger.debug('Current user session = ' + JSON.stringify(this.user));
  }

  set agent(agentId) {
    this.agentId = agentId;
  }

  get agent() {
    return this.agentId;
  }

  get authorization() {
    if (!this.user || !this.user.token) {
      return '';
    }
    return 'Bearer ' + this.user.token;
  }

  get memberId() {

    var memberId;

    for (var role in this.loggedInUser.userAccessRoles) {

      var currentRole = this.loggedInUser.userAccessRoles[role];

      if (currentRole.memberId) {
        memberId = currentRole.memberId;
      }

    }

    return memberId;
  }

  get organisationId() {
    
    if (!this.user.userAccessRoles) {
      return null;
    }
    
    for (let userAccessRole of this.user.userAccessRoles) {
      
      if (userAccessRole.accountType === 'ORGANISATION') {
        return userAccessRole.organisationId;
      }
    }
    
    return null;
  }

  get userRole() {

    var role;

    if (this.loggedInUser) {
      for (var roleIndex in this.loggedInUser.userAccessRoles) {

        var currentRole = this.loggedInUser.userAccessRoles[roleIndex];

        if (currentRole.role === 'Agent' || currentRole.role === 'Team Leader' || currentRole.role === 'Office Employee' || currentRole.role === 'QA' || currentRole.role === 'QA Manager') {

          role = currentRole.role.replace(' ', '_').toUpperCase();
        }
      }
    }

    return role;
  }

  get isSMSAllowed(){
    
    return this.loggedInUser.hasSMSChannel && this.loggedInUser.organisationUpgraded;
  }

  get isCallsAllowed() {
    return this.userRole === 'AGENT';
  }

  get isAdminRole() {
    
    if(!this.user || !this.user.userAccessRoles){
      return false;
    }
    
    for (let userAccessRole of this.user.userAccessRoles) {
      
      if (userAccessRole.accountType === 'ORGANISATION') {
        return userAccessRole.role === 'Administrator';
      }
    }
    
    return false;
  }

  get isTeamLeaderRole() {
    
    if(!this.user || !this.user.userAccessRoles){
      return false;
    }
    
    for (let userAccessRole of this.user.userAccessRoles) {
      
      if (userAccessRole.role === 'Team Leader') {
        return true;
      }
    }
    
    return false;
  }

  get isAgentRole() {
    
    if(!this.user || !this.user.userAccessRoles){
      return false;
    }
    
    for (let userAccessRole of this.user.userAccessRoles) {
      
      if (userAccessRole.role === 'Agent') {
        return true;
      }
    }
    
    return false;
  }

  get isOfficeEmployeeRole() {
    
    if(!this.user || !this.user.userAccessRoles){
      return false;
    }
    
    for (let userAccessRole of this.user.userAccessRoles) {
      
      if (userAccessRole.role === 'Office Employee') {
        return true;
      }
    }
    
    return false;
  }

  get isQAManagerRole() {
    
    if(!this.user || !this.user.userAccessRoles){
      return false;
    }
    
    for (let userAccessRole of this.user.userAccessRoles) {
      
      if (userAccessRole.role === 'QA Manager') {
        return true;
      }
    }
    
    return false;
  }

  get isQARole() {
    
    if(!this.user || !this.user.userAccessRoles){
      return false;
    }
    
    for (let userAccessRole of this.user.userAccessRoles) {
      
      if (userAccessRole.role === 'QA') {
        return true;
      }
    }
    
    return false;
  }

  retrieveUsername(cb) {

    this.retrieveUsernameCallback = cb;

    if (this.loggedInUser) {

      this.retrieveUsernameCallback(this.loggedInUser.email);
    }
  }

  retrieveUserId(cb) {

    this.retrieveUserIdCallback = cb;

    if (this.loggedInUser) {

      this.retrieveUserIdCallback(this.loggedInUser.userId);
    }
  }

  handleLogout() {
    
    logger.debug('handleLogout');
    
    sessionStorage.removeItem(this.key);
    this.user = null;
    this.agentId = null;
    this.loggedInUser = null;
  }

  set temperature(data) {
    
    sessionStorage.setItem('zai_temperature', JSON.stringify(data));
  }

  get temperature() {
    
    return JSON.parse(sessionStorage.getItem('zai_temperature'));
  }
}
