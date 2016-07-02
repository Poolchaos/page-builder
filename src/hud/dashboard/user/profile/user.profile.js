import {DashboardVessel} from 'zailab.framework';
/*
/*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {DashboardService} from '../../dashboard.service';
import {UserProfileConfig} from './user.profile.configuration';
import {UserProfileService} from './user.profile.service';
import {UserProfileStore} from './user.profile.store';
import {USER_PROFILE_ACTIONS} from './user.profile.actions';
/*
*/
const logger = LogManager.getLogger('UserProfile');
/*
*/
@inject(DashboardService, UserProfileConfig, UserProfileService, UserProfileStore)
export class UserProfile extends DashboardVessel {

  resolve = null;

  constructor(dashboardService, userProfileConfig, userProfileService, userProfileStore) {
    super(dashboardService, userProfileConfig);
    this.dashboardService = dashboardService;
    this.userProfileService = userProfileService;
    this.userProfileStore = userProfileStore;
  }

  activate() {
    this.neededActions.push(USER_PROFILE_ACTIONS.RETRIEVE_PERSONAL_INFO);
    this.neededActions.push(USER_PROFILE_ACTIONS.RETRIEVE_OUTBOUND_CALL_OPTIONS);
    this.neededActions.push(USER_PROFILE_ACTIONS.RETRIEVE_MEMBER_COMMS);
    this.neededActions.push(USER_PROFILE_ACTIONS.RETRIEVE_MEMBER_DEVICES);
    this.userProfileService.retrievePersonalInfo();
    this.userProfileService.retrieveMemberInformation();
  }

  get title() {
    return {subTitle: 'Personal Information'};
  }

  get icon() {
    return 'personal_information-';
  }

  @handle(USER_PROFILE_ACTIONS.RETRIEVE_PERSONAL_INFO)
  @waitFor(UserProfileStore)
  handleRetrievePersonalInfo(action, info) {
    this.completedActions.push(action);
    this.activateDashboard();
  }

  @handle(USER_PROFILE_ACTIONS.RETRIEVE_OUTBOUND_CALL_OPTIONS)
  @waitFor(UserProfileStore)
  handleRetrieveOutboundCallOptionsInfo(action, info) {
    this.completedActions.push(action);
    this.activateDashboard();
  }

  @handle(USER_PROFILE_ACTIONS.RETRIEVE_MEMBER_COMMS)
  @waitFor(UserProfileStore)
  handleRetrieveComms(action, info) {
    this.completedActions.push(action);
    this.activateDashboard();
  }

  @handle(USER_PROFILE_ACTIONS.RETRIEVE_MEMBER_DEVICES)
  @waitFor(UserProfileStore)
  handleRetrieveMemberDevices(action, info) {
    this.completedActions.push(action);
    this.activateDashboard();
  }
}