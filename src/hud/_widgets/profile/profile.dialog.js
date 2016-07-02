import {inject, ObserverLocator} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {Dispatcher, handle} from 'aurelia-flux';
import {ensure, Validation, ValidationRule} from 'aurelia-validation';
import {UniqueUsernameValidationRule}from '../../../onboarding/registration/completeregistration/complete.registration.validation';
import {UniqueEmailValidationRule}from '../../../onboarding/registration/completeregistration/complete.registration.validation';
import {UserSession} from '../../../_common/stores/user.session';
// Croppie from 'foliotek/croppie';

// 
// TODO CLEANUP VIEWMODEL
//
@inject(DialogController, Dispatcher, Validation, ValidationRule, UniqueUsernameValidationRule, UniqueEmailValidationRule, ObserverLocator, UserSession)
export class ProfileDialog {

  constructor(controller, dispatcher, validation, validationRule, uniqueUsernameValidationRule, uniqueEmailValidationRule, observerLocator, userSession) {
    this.controller = controller;
    this.controller.settings.lock = false;
    this.dispatcher = dispatcher;
    this.validation = validation.on(this);
    this.uniqueUsernameValidationRule = uniqueUsernameValidationRule;
    this.uniqueEmailValidationRule = uniqueEmailValidationRule;
    this.observer = observerLocator;
    this.userSession = userSession;

    // Password Validation
    this.passwordValidation = validation.on(this)
      .ensure('profileStore.newPassword', config => {
        config.computedFrom(['profileStore.newPassword']);
      })
      .isNotEmpty().hasLengthBetween(2, 12).containsNoSpaces().isStrongPassword()
      .ensure('profileStore.oldPassword')
      .isNotEmpty()
      .ensure('profileStore.confirmPassword')
      .isEqualTo(() => {
        return this.profileStore.newPassword;
      }, 'the entered password');

    // Email Validation
    this.emailValidation = validation.on(this)
      .ensure('profileStore.newEmail')
      .isNotEmpty().isEmail().passesRule(this.uniqueEmailValidationRule)
      .matches(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/)
        .withMessage((newValue, threshold) => {return `is not a valid email address`;});

    // Username Validation
    this.usernameValidation = validation.on(this)
      .ensure('profileStore.newUsername', config => {
        config.useDebounceTimeout(150);
      })
      .isNotEmpty().hasLengthBetween(2, 20).containsNoSpaces().matches(/^([a-zA-Z0-9])+$/).passesRule(this.uniqueUsernameValidationRule);

    // Userinfo Validation
    this.userInfoValidation = validation.on(this)
      .ensure('profileStore.userInfo.firstName', config => {})
      .isNotEmpty().hasLengthBetween(2, 30).containsNoSpaces().matches(/^([a-zA-Z_-])+$/)
      .withMessage((newValue, threshold) => {return `is not a valid input`;})
      .ensure('profileStore.userInfo.surname', config => {
        config.useDebounceTimeout(150);
      }).isNotEmpty().hasLengthBetween(2, 30).containsNoSpaces().matches(/^([a-zA-Z_-])+$/)
      .withMessage((newValue, threshold) => {return `is not a valid input`;});
  }

  activate(profileViewModel) {
    var userId = this.userSession.user.userId;
    this.profileStore = profileViewModel.profileStore;
    this.profileService = profileViewModel.profileService;
    
    this.profileService.retrieveUserInfo(userId);
    this.profileService.retrieveOutboundCallOptions();
    this.observer.getObserver(this.profileStore, 'selectedFiles')
    .subscribe((files) => {this.profilePictureSelected(files)});

    this.dispatcher.dispatch('blur.event');
  }

  attached(){
    this.imageCropper = new Croppie(this.filePreview, {
      viewport: {
      width: 210,
      height: 210,
      type: 'circle' //default 'square'
    },
      boundary: {
      width: 210,
      height: 210
    },
      customClass: 'imageCropper',
      enableZoom: true, //default true // previously showZoom
      showZoomer: true, //default true
      mouseWheelZoom: true, //default true
      update: function (cropper) { }
    });
  }

  profilePictureSelected(files){
    this.profileStore.changingProfilePicture = true; // TODO handle in store
    var file = files[0];
    var tmpURL = URL.createObjectURL(file);
    this.imageCropper.bind({
    url: tmpURL
    });
  }

  updateProfilePicture(){
    this.imageCropper.result('canvas').then(imgBase64 => {
      var rawBase64 = imgBase64.split('base64,')[1];
      this.profileService.changeProfilePicture(rawBase64);
    });
  }

  close() {
    this.controller.cancel();
    this.profileService.clearPasswordInput();
    this.dispatcher.dispatch('remove.blur.event');
  }

  changeOutboundflowStatus(selectedStatus) {
    var flowId = selectedStatus.flowId;
    this.profileService.selectOutboundCallOption(flowId);
  }

  toggleEditInfo(prop, state){
    this.profileService.clearPasswordInput();
    this.profileService.changeEditState(prop, state);
  }

  changeName(newName){
    this.profileService.setError('');
    this.userInfoValidation.validate()
      .then(() => {
      var firstName = newName;
      var surname = this.profileStore.userInfo.surname;
      var userId = this.profileStore.userInfo.userId;
      var gender = this.profileStore.userInfo.gender ? this.profileStore.userInfo.gender : '';
      var dateOfBirth = this.profileStore.userInfo.dateOfBirth ? this.profileStore.userInfo.dateOfBirth : '';
      var telephoneNumbers = this.profileStore.userInfo.telephoneNumbers;
      this.profileService.changeUserInfo(firstName, surname, userId, gender, dateOfBirth, telephoneNumbers);
    },error =>{});
  }

/*  changeUsername(newUsername, password){
    this.profileService.setError('');
    this.usernameValidation.validate()
      .then(() => {
        var previousUsername = this.profileStore.userInfo.username;
        this.profileService.changeUsername(previousUsername, newUsername, password);
        this.profileService.clearPasswordInput();
    },error =>{});
  }*/

  changeEmail(newEmail, password){
    this.profileService.setError('');
    this.emailValidation.validate()
      .then(() => {
        var previousEmail = this.profileStore.userInfo.emails[0];
        this.profileService.changeEmail(previousEmail, newEmail);
    }, error =>{});
  }

  changePassword(previousPassword) {
    this.profileService.setError('');
    this.passwordValidation.validate()
      .then(() => {
        var previousPassword = this.profileStore.oldPassword;
        var newPassword = this.profileStore.newPassword;
        this.profileService.changePassword(previousPassword, newPassword);
      },error =>{});
  }

}
