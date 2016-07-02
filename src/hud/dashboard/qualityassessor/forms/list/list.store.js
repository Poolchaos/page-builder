/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
import {DateTimeTools, SortTools} from 'zailab.common';
/*
*/
import {LIST_ACTIONS} from './list.actions';
/*
*/
const logger = LogManager.getLogger('ListStore');
/*
*/
let STATE = {

  forms: []
};
/*
*/
@inject(DateTimeTools)
export class ListStore {
  
  constructor(dateTimeTools){
    
    this.dateTimeTools = dateTimeTools;
  }
  
  get forms(){
    
    return STATE.forms;
  }
  
  @handle(LIST_ACTIONS.RETRIEVE_FORMS)
  handleRetrieveForms(action, forms) {

    for(let form of forms) {

      let dateObj = this.dateTimeTools.convertToLocalTime(form.createdTimestamp, 'UTC').dateObj;
      let formattedDate = dateObj.toLocaleString('en-us', { day: '2-digit', month: 'short' });
      form.date = formattedDate;
    }

    STATE.forms = forms;
    STATE.forms.sort(SortTools.compareBy('name'));
  }
  
}