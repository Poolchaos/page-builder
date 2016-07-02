/*
*/
import {OrganisationWidgetStore} from './organisation.store';
import {OrganisationWidgetService} from './organisation.service';
import {ORGANISATION_ACTIONS} from '../../dashboard/organisation/organisation.actions';
import {HeadsUpDisplayStore} from '../../hud.store';
/*
 */
import {UserSession} from 'zailab.common';
/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationWidget');
/*
*/
@inject(OrganisationWidgetStore, OrganisationWidgetService, UserSession, Router, EventAggregator)
export class OrganisationWidget {

  constructor(organisationWidgetStore, organisationWidgetService, userSession, router, eventAggregator) {
    this.organisationStore = organisationWidgetStore;
    this.organisationService = organisationWidgetService;
    this.userSession = userSession;
    this.router = router;
    this.eventAggregrator = eventAggregator;
  }

  activate() {

    this.eventAggregrator.subscribe(ORGANISATION_ACTIONS.UPDATE_ORGANISATION_WIDGET, newOrganisationName => {
            
      this.organisationService.updateOrganisationName(newOrganisationName);
    });

    this.organisationService.retrieveOrganisationInfo();
  }

  organisationMenu() {
    this.router.navigate('dashboard/organisation');
  }

  organisationEdit() {
    this.router.navigate('dashboard/organisation/setup');
  }

  navToHome() {
    
    this.organisationService.navigate();
  }
  
  @handle('organisation.profile.select')
  @waitFor(HeadsUpDisplayStore)
  handleViewProfile() {
    
    if (!this.organisationStore.organisation.organisationName) {

      return;
    }
        
    setTimeout(() => {
      
      if(this.userSession.isAdminRole) {
        
        this.router.navigate('dashboard/organisation/manage');
      } else if(this.userSession.isAgentRole) {

        this.router.navigate('dashboard/members');
      } else if(this.userSession.isTeamLeaderRole) {

        this.router.navigate('dashboard/members');
      } else if(this.userSession.isOfficeEmployeeRole) {

        this.router.navigate('dashboard/members');
      } else if(this.userSession.isQAManagerRole || this.userSession.isQARole) {

        this.router.navigate('dashboard/members');
      } else {

        this.organisationEdit();
//        this.router.navigate('dashboard/organisation/setup');
      }      
    }, 53);
  }

  @handle('organisation.profile.change.picture')
  handleChangePicture(action, base64){

    this.url = base64;
  }
}
