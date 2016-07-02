/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {UserProfileStore} from '../user.profile.store';
import {UserProfileService} from '../user.profile.service';
import {USER_PROFILE_ACTIONS} from '../user.profile.actions';
/*
*/
const logger = LogManager.getLogger('UserProfileOutboundFlows');
/*
*/
@inject(UserProfileStore, UserProfileService)
export class UserProfileOutboundFlows {

  title = 'Outbound Flows';
  label;

  constructor(userProfileStore, userProfileService) {

    this.userProfileStore = userProfileStore;
    this.userProfileService = userProfileService;
  }

  activate() {

    this.setOutboundFlow();
  }

  setOutboundFlow() {

    this.label = this.userProfileStore.selectedOutboundFlow.flowName;
  }

  @handle(USER_PROFILE_ACTIONS.CHANGE_OUTBOUND_FLOW)
  @waitFor(UserProfileStore)
  handleChangeOutboundFlow(action, model) {

    this.userProfileService.selectOutboundCallOption(this.userProfileStore.selectedOutboundFlow.flowId);
    this.setOutboundFlow();
  }

}
