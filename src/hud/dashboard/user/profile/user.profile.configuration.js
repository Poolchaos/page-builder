import {PromptFactory} from 'zailab.framework';
/*
*/
import {inject} from 'aurelia-framework';
/*
*/
import {USER_PROFILE_ACTIONS} from './user.profile.actions';
import {UserProfileStore} from './user.profile.store';
/*
*/
@inject(PromptFactory, UserProfileStore)
export class UserProfileConfig {

    constructor(promptFactory, userProfileStore) {

      this.promptFactory = promptFactory;
      this.userProfileStore = userProfileStore;
    }

    get helmViewModel() {

      return 'hud/dashboard/user/profile/user.profile.helm';
    }

    get portItems() {

      let changeProfilePicturePrompt = this.promptFactory.buildPicturePrompt('Upload Picture', USER_PROFILE_ACTIONS.CHANGE_PICTURE);

      let changeNameModel = {
        firstName: this.userProfileStore.userInfo.firstName, surname: this.userProfileStore.userInfo.surname, isName: true,
        customMessage: {
          firstName: 'Enter first name',
          surname: 'Enter surname'
        }
      };
      let changeNamePrompt = this.promptFactory.buildFormPrompt('Name', changeNameModel, USER_PROFILE_ACTIONS.CHANGE_NAME);

      changeProfilePicturePrompt.promptModel.icon = 'picture';
      changeNamePrompt.promptModel.icon = 'name';

      return [

          {
            name: 'Name',
            icon: 'name',
            viewModel: 'hud/dashboard/user/profile/name/user.profile.name',
            option: changeNamePrompt
          },
          {
            name: 'Picture',
            icon: 'name',
            viewModel: 'hud/dashboard/user/profile/picture/user.profile.picture',
            option: changeProfilePicturePrompt
          }

        ];
    }

    get starboardItems() {

      let changeOutboundFlowPrompt = this.promptFactory.buildSingleSelectOnlyPrompt('Outbound Flows', this.userProfileStore.outboundFlows, USER_PROFILE_ACTIONS.CHANGE_OUTBOUND_FLOW);
      changeOutboundFlowPrompt.promptModel.icon = 'outbound_call';
      let changePasswordPrompt = this.promptFactory.buildFormPrompt('Password', {
        old: '',
        new: '',
        confirm: '',
        isPassword: true,
        customMessage: {
          old: 'Enter current password',
          new: 'Enter new password',
          confirm: 'Confirm new password'
        }
      }, USER_PROFILE_ACTIONS.CHANGE_PASSWORD);

      changePasswordPrompt.promptModel.icon = 'password';

      return [

          {
            name: 'Password',
            icon: 'outbound_call',
            viewModel: 'hud/dashboard/user/profile/outboundflows/user.profile.outboundflows',
            option: changeOutboundFlowPrompt
          },
          {
            name: 'Password',
            icon: 'password',
            viewModel: 'hud/dashboard/user/profile/password/user.profile.password',
            option: changePasswordPrompt
          }

        ];

    }

}
