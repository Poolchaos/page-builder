import {customElement, bindable, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('DashboardCamp');
/*
*/
@customElement('dashboard-camp')
export class DashboardCamp {

  @bindable position;
}
