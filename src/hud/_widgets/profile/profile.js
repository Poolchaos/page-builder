/*
zailab
*/
import {ProfileDialog}        from './profile.dialog';
import {ProfileService}       from './profile.service';
import {ProfileStore}         from './profile.store';
import {UserSession}          from '../../../_common/stores/user.session';
import {HUD_ANIMATOR_EVENTS}  from '../../hud.animator.events';
/*
aurelia
*/
import {DialogService}        from 'aurelia-dialog';
import {inject, LogManager}               from 'aurelia-framework';
import {Router}               from 'aurelia-router';
import {Dispatcher, handle}   from 'aurelia-flux';
import {EventAggregator}      from 'aurelia-event-aggregator';
/*
Profile Widget - show a dialog on profile information
*/

const logger = LogManager.getLogger('Profile');

@inject(ProfileService, ProfileStore, DialogService, Dispatcher, EventAggregator, UserSession, Router)
export class AgentProfile {

  _pictureUrl;
  
  constructor(profileService, profileStore, dialogService, dispatcher, eventAggregator, userSession, router) {
    this.userSession = userSession;
    this.dialogService = dialogService;
    this.eventAggregator = eventAggregator;
    this.profileService = profileService;
    this.profileStore = profileStore;
    this.router = router;
  }
  
  activate(){
    
    this.profileService.retrievePersonalInfo();
    
    this.eventAggregator.subscribe('change.user.profile.picture', (data) => { 
      this._pictureUrl = data;
    });
    
  }
  
  /*profile() {
    this.router.navigate('dashboard');
  }*/

  /*activateIgnore(){    
    var userId = this.userSession.user.userId;
		let ownerIdCheck = this.userSession.loggedInUser.userAccessRoles[0].ownerId;
    let ownerId = ownerIdCheck ? ownerIdCheck : this.userSession.loggedInUser.userAccessRoles[1].ownerId;
		this.profileService.retrieveOrganisationInfo(ownerId);
    this.profileService.retrieveUserInfo(userId);
    this.profileService.retrieveOutboundCallOptions();
    this.profileService.retrieveSelectedOutboundCallOption();
  }*/

  navToUserProfile(){
    this.router.navigate('dashboard/user/profile');
  }
  
  /*changeProfilePicture() {
    this.dialogService.open({
      viewModel: ProfileDialog,
      model: this
    }).then(response => {
      if (!response.wasCancelled) {
        // TODO handle OK
      } else {
        // TODO handle Cancel
      }
    
        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      })
    ;
    
    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }*/
}