import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {ApplicationService} from 'zailab.common';
import {LIVE_DASHBOARD_ACTIONS} from './live.dashboard.actions';
import {UserSession} from 'zailab.common';
import {DatabaseService} from 'zailab.common';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LiveDashboardDatabaseService} from './live.dashboard.database.service';

@inject(ApplicationService, Dispatcher, UserSession, DatabaseService, EventAggregator, LiveDashboardDatabaseService)
export class LiveDashboardService {

  service;
  
  constructor(applicationService, dispatcher, userSession, databaseService, eventAggregator, liveDashboardDatabaseService) {
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.databaseService = databaseService;
    this.eventAggregator = eventAggregator;
    this.liveDashboardDatabaseService = liveDashboardDatabaseService;
  }

  registerDashboardDatabaseOperation(id) {

    if(this.service) {
      
      this.liveDashboardDatabaseService.onPageClose(this.service);
    }
    
    this.liveDashboardDatabaseService.onRealtimeDashboardUpdated(id, data => {
      
      this.eventAggregator.publish(LIVE_DASHBOARD_ACTIONS.DASHBOARD_UPDATED, data);
    });
    
    this.service = id;
    
    
    
//    this.databaseService.onRealtimeDashboardUpdate(id, data => {
//
//      // this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.DASHBOARD_UPDATED, data);
//      this.eventAggregator.publish(LIVE_DASHBOARD_ACTIONS.DASHBOARD_UPDATED, data); // dispatcher events does not always get handled (intermittent).
//      // eventAggregator is a temp solution
//    });
  }
  
  registerEvents() {

    let organisationId = this.userSession.organisationId;
    this.organisationInvitationsDatabaseService.onPendingInvitesUpdated(organisationId, response=> {
      this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.REPLACE_INVITES, response.invitations);
    });
  }

  deregisterEvents() {

    this.dispatcher.dispatch(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITES, []);

    this.organisationInvitationsDatabaseService.onPageClose(this.userSession.organisationId);
  }

  retreieveLiveDashboardStats(date, serviceId, organisationId) {
    
    this.registerDashboardDatabaseOperation(serviceId);
    
    this.applicationService.displayOrganisationDashboardServiceDashboard(date, serviceId, organisationId)
    .then(
      response => {
        if (response.displayServiceDashboardView && response.displayServiceDashboardView[0]){
          var mongoDocId = response.displayServiceDashboardView[0].id;
          this.registerDashboardDatabaseOperation(mongoDocId);
          this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.LIVE_DASHBOARD_RETRIEVED, response.displayServiceDashboardView[0]);
        }else{
          this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.LIVE_DASHBOARD_RETRIEVED);
        }
      },
      error => {
        this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.LIVE_DASHBOARD_FAILED, error);
      }
    );
  }

  retrieveOrganisationServices(organisationId, callback) {
    this.applicationService.displayOrganisationSelectedServicesSearch(organisationId).then(
      response => {
        
        let noservices = Object.keys(response).length;
        if (response.displaySelectedServicesView && response.displaySelectedServicesView[0]) {
          var firstService = response.displaySelectedServicesView[0].selectedServices[0];
          this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.ORGANISATION_SERVICES_RETRIEVED, response.displaySelectedServicesView[0].selectedServices);
          callback(firstService);
        }
        else{
        this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.ORGANISATION_SERVICES_RETRIEVED, noservices);
        }
        },
      error => {
        this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.ORGANISATION_SERVICES_FAILED, error);
      }
    );
  }

  selectService(service) {
    this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.SERVICE_SELECTED, service);
  }

  retrieveOrganisationId() {

    let organisationId = '';

    for (var item in this.userSession.user.userAccessRoles) {

      if (this.userSession.user.userAccessRoles[item].accountType === 'ORGANISATION') {
        organisationId = this.userSession.user.userAccessRoles[item].organisationId;
      }
    }

    this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.ORGANISATION_ID_RETIEVED, organisationId);
    return organisationId;
  }

  viewModelActivated() {
    this.dispatcher.dispatch(LIVE_DASHBOARD_ACTIONS.VIEW_ACTIVATED);
  }

  changeView(view) {
    this.dispatcher.dispatch('view.change', view);
  }

}
