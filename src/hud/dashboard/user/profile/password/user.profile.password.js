/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {UserProfileStore} from '../user.profile.store';
import {UserProfileService} from '../user.profile.service';
import {USER_PROFILE_ACTIONS} from '../user.profile.actions';
import {EncryptTools} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('UserProfilePassword');
/*
*/
@inject(UserProfileStore, UserProfileService)
export class UserProfilePassword {

  title = 'password';
  label;

  constructor(userProfileStore, userProfileService) {
    
    this.userProfileStore = userProfileStore;
    this.userProfileService = userProfileService;
  }

  activate(){

    this.setPassword();
  }

  setPassword() {
 
    this.label = '********';
  }



  @handle(USER_PROFILE_ACTIONS.CHANGE_PASSWORD)
  handleChangePassword(action, model) {

    let oldPassword = EncryptTools.encrypt(model.item.old);
    let newPassword = EncryptTools.encrypt(model.item.new);
    
    this.userProfileService.changePassword(oldPassword, newPassword);
  }

}
