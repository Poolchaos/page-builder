/*
zailab
*/
import {DASHBOARD_ACTIONS} from './dashboard.actions';
/*
aurelia
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
Logger
*/
const logger = LogManager.getLogger('DashboardStore');
/*
STATE
*/
let STATE = {

  helmViewModel: null,
  portItems: null,
  starboardItems: null
};
/*
Dashboard Store - wraps the org state neatly
*/
export class DashboardStore {
	
	get guideViewModel() {
		
    return STATE.guideViewModel;
	}

  get helmViewModel() {

    return STATE.helmViewModel;
  }

  get portItems() {
		
		if (STATE.portItems) {
		
			for (let item of STATE.portItems) {

				let name = item.name.toLowerCase();
				let parts = name.split(' ');

				name = '';
				for (let part of parts) {

					if (name.length > 0) {
						name += '-';
					}
					name += part;
				}

				item._connectorReference = `port-connector-${name}`;
			}
		}

    return STATE.portItems;
  }

  get starboardItems() {

    return STATE.starboardItems;
  }

  @handle(DASHBOARD_ACTIONS.ACTIVATE_DASHBOARD)
  handleActivateDashboard(action, config) {
    
    STATE.helmViewModel = config.helmViewModel;
    STATE.portItems = config.portItems;
    STATE.starboardItems = config.starboardItems;
  }

  @handle(DASHBOARD_ACTIONS.DEACTIVATE_DASHBOARD)
  handleDeactivateDashboard() {
    
    STATE.helmViewModel = null;
    STATE.portItems = null;
    STATE.starboardItems = null;
  }

  @handle(DASHBOARD_ACTIONS.SELECT_PORT_OPTION)
  handleSelectPortOption(action, option) {

    selectOption(option, STATE.portItems);
  }

  @handle(DASHBOARD_ACTIONS.SELECT_STARBOARD_OPTION)
  handleSelectStarboardOption(action, option) {

    selectOption(option, STATE.starboardItems);
  }
}
/*
private functions
*/
function selectOption(option, items) {

  for (let item of items) {

    if (!items[item] || items[item].option.isSelected === false) {
      continue;
    }

    items[item].option.isSelected = false;
  }

  option.isSelected = true;
}
/*
*/
