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
import {EventAggregator}from 'aurelia-event-aggregator';
/*
 */
const logger = LogManager.getLogger('UserProfileName');
/*
 */
@inject(UserProfileStore, UserProfileService, EventAggregator)
export class UserProfileName {

  title = 'name';
  label;
  display = 'name';

  constructor(userProfileStore, userProfileService, eventAggregator) {

    this.userProfileStore = userProfileStore;
    this.userProfileService = userProfileService;
    this.eventAggregator = eventAggregator;
  }

  activate() {

    this.setName();
  }

  setName(firstName, surname) {

    this.label = this.userProfileStore.userInfo.firstName + ' ' + this.userProfileStore.userInfo.surname;

  }

  @handle(USER_PROFILE_ACTIONS.CHANGE_NAME)
  @waitFor(UserProfileStore)
  handleChangeName(action, model) {
    let firstName = model.item.firstName;
    let surname = model.item.surname;
    this.setName(firstName, surname);

    this.userProfileService.changeUserInfo(firstName, surname);
    this.eventAggregator.publish('update.user.name', {firstName: firstName, surname: surname});

  }

}
