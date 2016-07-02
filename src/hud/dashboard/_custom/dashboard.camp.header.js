import {customElement, bindable} from 'aurelia-framework';
/*
*/
@customElement('dashboard-camp-header')
export class DashboardCampHeader {

  @bindable title;
  
  showCamp = true;
}
