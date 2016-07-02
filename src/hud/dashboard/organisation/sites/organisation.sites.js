/*
*/
import {Crud, PromptFactory, PromptService} from 'zailab.framework';
/*
*/
import {ORGANISATION_SITES_ACTIONS} from './organisation.sites.actions';
import {OrganisationSitesStore} from './organisation.sites.store';
import {OrganisationSitesService} from './organisation.sites.service';
import {UniqueSiteValidationRule} from './organisation.sites.validation';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationSites');
/*
*/
@inject(OrganisationSitesStore, OrganisationSitesService, PromptFactory, PromptService, Router)
export class OrganisationSites {

  settings = {
    add: {enabled: true},
    delete: {enabled: true},
    select: {enabled: false},
    edit: {enabled: false},
    labels: {enabled: true}
  };

  display = 'siteName';

	options = {
    add: () => this.add(),
    remove: (items) => this.remove(items)
	};

  guide = 'This is a list of the sites in your organisation. Sites explain where your organisation is located. This will help to match communication from your customers to members in the appropriate location.';

  resolve = null;

  constructor(organisationSitesStore, organisationSitesService, promptFactory, promptService, router) {

    this.organisationSitesStore = organisationSitesStore;
    this.organisationSitesService = organisationSitesService;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
    this.router = router;
  }

  canActivate() {
    
    this.organisationSitesService.retrieveSites();
    
    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.organisationSitesStore.sites.length;
  }

  done() {

    this.router.navigate('');
  }

  add() {
    this.organisationSitesService.openAddSitePrompt(this.organisationSitesStore.sites);
  }


  remove(sites) {
    this.organisationSitesService.removeSite(sites);
  }

  compare(site, searchText) {

    if (site.siteName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
      return true;
    }

    return false;
  }

  @handle(ORGANISATION_SITES_ACTIONS.RETRIEVE_SITES_SUCCESS)
  @waitFor(OrganisationSitesStore)
  handleRetrieveSitesSuccess(action, model) {
    
    if (this.resolve !== null) {
      
      this.resolve(true);
      this.resolve = null;
    }
  }

  @handle(ORGANISATION_SITES_ACTIONS.ACCEPT_ADD_SITE)
  @waitFor(OrganisationSitesStore)
  handleAcceptAddSite(action, model) {
    let siteId = model.item.id;
    let siteName = model.item.siteName;
    this.organisationSitesService.addSite(siteId, siteName);
  }
}
