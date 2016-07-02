/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
 */
import {DateTimeTools, SortTools} from 'zailab.common';
/*
 */
import {VIEW_ACTIONS} from './view.actions.js';
/*
 */
const logger = LogManager.getLogger('ViewStore');
/*
 */
let STATE = {

  forms: [],
  searchedForms: []
};
/*
 */
@inject(DateTimeTools)
export class ViewStore {

  constructor(dateTimeTools){

    this.dateTimeTools = dateTimeTools;
  }

  get forms(){

    return STATE.forms;
  }

  get searchedForms(){
    return STATE.searchedForms;
  }

  @handle(VIEW_ACTIONS.RETRIEVE_FORMS)
  handleRetrieveForms(action, forms) {
    for(let form of forms) {

      let dateObj = this.dateTimeTools.convertToLocalTime(form.assessmentDate, 'UTC');
      
      form.date = dateObj;

      if(form.channel === 'Outbound Call'){
        form.channel = 'outbound';
      }
      else if (form.channel === 'Inbound Call'){
        form.channel = 'inbound';
      }
      else if (form.channel === 'Kiosk'){
        form.channel = 'kiosk';
      }
      else if (form.channel === 'SMS'){
        form.channel = 'sms';
      }
      else{
        form.channel = 'email';
      }
    }

    STATE.forms = forms;
    STATE.forms.sort(SortTools.compareBy('assessmentDate')).reverse();
  }

}