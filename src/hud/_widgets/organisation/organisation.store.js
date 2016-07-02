/*
*/
import {ORGANISATION_WIDGET_ACTIONS} from './organisation.actions';
/*
*/
import {handle} from 'aurelia-flux';
import {LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('OrganisationWidgetStore');
/*
 */
let STATE = {
  organisation: {}
};
/*
*/
export class OrganisationWidgetStore {

  get organisation() {
    return STATE.organisation;
  }

  set organisation(organisation) {
    STATE.organisation = organisation;
  }

  @handle(ORGANISATION_WIDGET_ACTIONS.RETRIEVE_ORGANISATION_INFO)
  handleRetrieveOrganisationInfo(action, organisation) {

    this.organisation = organisation;

  }

    @handle(ORGANISATION_WIDGET_ACTIONS.CHANGE_ORGANISATION_NAME)
    handleChangeOrganisationName(action, organisationName) {
      this.organisation.organisationName = organisationName;
    }
}
