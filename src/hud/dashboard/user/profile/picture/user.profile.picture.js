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
const logger = LogManager.getLogger('UserProfilePicture');
/*
*/
@inject(UserProfileStore, UserProfileService, EventAggregator)
export class UserProfilePicture {

  title = 'picture';
  label;
  display = 'name';

  _picture = null;

  constructor(userProfileStore, userProfileService, eventAggregator) {
    
    this.userProfileStore = userProfileStore;
    this.userProfileService = userProfileService;
    this.eventAggregator = eventAggregator;
    
    this.eventAggregator.subscribe('update.user.name', payload => this.setProfilePicture());
  }

  activate(){

    this.setProfilePicture();
  }

  setProfilePicture(url) {

    this._picture = [
      {
        pictureId: this.userProfileStore.userInfo.personId,
        defaultPicture: 'target/_assets/img/profile_pic-holder.png',
        pictureURL: url,
        name: this.userProfileStore.userInfo.firstName + ' ' + this.userProfileStore.userInfo.surname
      }
    ];
  }


@handle(USER_PROFILE_ACTIONS.CHANGE_PICTURE)
@waitFor(UserProfileStore)
handleChangePicture(action, base64){

  let rawBase64 = base64.split('base64,')[1];
  
  this.userProfileService.updateProfilePicture(rawBase64);
  this.setProfilePicture(base64);
  this.eventAggregator.publish('change.user.profile.picture', base64);
  this.eventAggregator.publish('change.picture', {id:this.userProfileStore.userInfo.personId, data:base64});
  
}

}
