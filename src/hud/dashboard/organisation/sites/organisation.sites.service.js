/*
*/
import {UserSession, ApplicationService, PromptFactory, PromptService} from 'zailab.framework';
import {ORGANISATION_SITES_ACTIONS} from './organisation.sites.actions';
/*
*/
import {UniqueSiteValidationRule} from './organisation.sites.validation';
import {OrganisationSitesStore} from  './organisation.sites.store';
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebSocket} from '../../../../_common/services/websocket';
/*
*/
const logger = LogManager.getLogger('OrganisationSitesService');
/*
*/
import uuid from 'node-uuid';
/*
*/

@inject(Dispatcher, ApplicationService, UserSession, PromptFactory, PromptService, EventAggregator, WebSocket, OrganisationSitesStore)
export class OrganisationSitesService {

  constructor(dispatcher, applicationService, userSession, promptFactory, promptService, eventAggregator, webSocket, organisationSitesStore) {
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
    this.eventAggregator = eventAggregator;
    this.webSocket  = webSocket;
    this.organisationSitesStore = organisationSitesStore;
    this.registerEvents();
  }

  registerEvents() {
    this.eventAggregator.subscribe('ValidationErrorsReceived', response => this.handleValidationErrors(response));
  }

  handleValidationErrors(response) {
    if (response.state.objectName === 'removeSiteCommand') {

      let organisationId = response.state.entity.organisationId;
      let siteId = response.state.entity.siteId;
      let siteName = response.state.entity.siteName;

      let site = {organisationId: organisationId,  siteId: siteId, siteName: siteName};

      this.dispatcher.dispatch(ORGANISATION_SITES_ACTIONS.ADD_SITE, site);

    }
  }

  retrieveSites() {

    let organisationId = this.userSession.organisationId;

    this.applicationService.displaySitesSearch(organisationId).then(
      (response) => {
        let sites = resolveSitesResponse(response);
        this.dispatcher.dispatch(ORGANISATION_SITES_ACTIONS.RETRIEVE_SITES_SUCCESS, sites);
      });

  }

  openAddSitePrompt(sites) {

    let title = 'Add Site';
    let item = {id: uuid.v4(), siteName: ''};
    let acceptAction = ORGANISATION_SITES_ACTIONS.ACCEPT_ADD_SITE;

    let option = this.promptFactory.buildFormPrompt(title, item, acceptAction);
    option.promptModel.icon = 'sites';
    option.promptModel.rule = {
      siteName: new UniqueSiteValidationRule(sites)
    };

    this.promptService.openPrompt(option);
  }

  addSite(siteId, siteName) {
    let organisationId = this.userSession.organisationId;
    this.applicationService.addSite(organisationId, siteId, siteName);

    let sites = {organisationId: organisationId, siteId: siteId, siteName: siteName};

    this.dispatcher.dispatch(ORGANISATION_SITES_ACTIONS.ADD_SITE, sites);

  }

  removeSite(sites) {
    for (let site of sites) {
      let organisationId = this.userSession.organisationId;
      let siteId = site.siteId;
      let siteName = site.siteName;
      this.applicationService.removeSite(organisationId, siteId, siteName);
    }
  }
}


function resolveSitesResponse(response) {

  let sites = [];

  if (response && response.displaySitesView) {
    sites = response.displaySitesView[0].sites;
  }

  return sites;
}
