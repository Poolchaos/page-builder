/*
*/
import {ORGANISATION_SITES_ACTIONS} from './organisation.sites.actions';
/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {SortTools} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('OrganisationSitesStore');
import toastr from 'toastr';
/*
*/
var errorMessage = '';
var siteId = '';
var siteName = '';

let STATE = {

  sites: []
};
/*
*/
export class OrganisationSitesStore {

  get sites() {

    for (let site of STATE.sites) {

      site.text = [site.siteName];
      site.labelPosition = 'out';
      site.labelClassName = 'o-crud-list__icon o-crud-list__icon--sites';
    }

    return STATE.sites;

  }

  @handle(ORGANISATION_SITES_ACTIONS.RETRIEVE_SITES_SUCCESS)
  handleRetrieveSitesSuccess(action, sites) {
    STATE.sites = sites;
  }

  @handle(ORGANISATION_SITES_ACTIONS.ADD_SITE)
  handleAcceptAddSite(action, model) {
    STATE.sites.push({siteName: model.siteName, siteId: model.siteId});
  }

  @handle(ORGANISATION_SITES_ACTIONS.ACCEPT_CHANGE_SITE)
  handleAcceptChangeSite(action, model) {
    let changedSite = model.item;

    for (let site of STATE.sites) {
      if (site.id === changedSite.id) {
        site.name = changedSite.name;
        break;
      }
    }
  }
}
