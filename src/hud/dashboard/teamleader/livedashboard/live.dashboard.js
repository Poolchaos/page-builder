import {inject} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {LiveDashboardService} from './live.dashboard.service';
import {LiveDashboardStore} from './live.dashboard.store';
import {UserSession} from 'zailab.framework';
import {LIVE_DASHBOARD_ACTIONS} from './live.dashboard.actions';
import {Dispatcher} from 'aurelia-flux';

@inject(LiveDashboardService, LiveDashboardStore, Dispatcher, UserSession)
export class LiveDashboard {
  
  isReady;
    
  constructor(liveDashboardService, liveDashboardStore, dispatcher, userSession) {
    this.liveDashboardService = liveDashboardService;
    this.liveDashboardStore = liveDashboardStore;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.isReady = false;
  }

  attached(){
    this.isReady = true;
    this.liveDashboardService.viewModelActivated();
  }
  
    get taskNoDataClass() {
    
    if (this.liveDashboardStore.services === null || this.liveDashboardStore.services === 0) {
      return 'o-dropdown__button--no-data';
    }
    
    return '';
  }
  
  @handle(LIVE_DASHBOARD_ACTIONS.VIEW_ACTIVATED)
  handleViewActivated() {    
    var organisationId = this.liveDashboardService.retrieveOrganisationId();
    this.liveDashboardService.retrieveOrganisationServices(organisationId, (service) => {
      this.selectService(service);
    });
  }
  
  deactivate(){
    clearInterval(this.liveDashboardStore.dateTimer);
  }

  selectService(service){
    this.liveDashboardService.selectService(service);
    this.fetchDashboardData(service.serviceId);
  }
  
  fetchDashboardData(serviceId){ 
    
        let organisationId = '';

    for (var item in this.userSession.user.userAccessRoles) {

      if (this.userSession.user.userAccessRoles[item].accountType === 'ORGANISATION') {

        organisationId = this.userSession.user.userAccessRoles[item].organisationId;
      }
    }

     var date = this.liveDashboardStore.currentDateTime.queryDate;
    this.liveDashboardService.retreieveLiveDashboardStats(date, serviceId, organisationId);

  }
  
  navTo(view) {
    this.liveDashboardService.changeView(view);
  }

  @handle('view.change') // TODO Move to actions
  handleViewChange(message, view) {
    this.selectService(this.liveDashboardStore.selectedService);
  }

}