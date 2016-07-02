import {customElement, bindable} from 'aurelia-framework';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {UserSession} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('DashboardVesselHeader');
/*
*/
@inject(UserSession)
@customElement('dashboard-vessel-header')
export class DashboardVesselHeader {

  @bindable title;
}