/*
zailab
*/

/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class AddTeamStore {
  
  constructor(dialogController) {
  
    this.controller = dialogController;
  }
  
  @handle(ADD_TEAM_ACTIONS.TEAM_ADDED_SUCCESSFUL)
  handleAddTeamAddedSuccessful() {
    this.controller.cancel();
  }
  
  @handle(ADD_TEAM_ACTIONS.TEAM_ADDED_FAILED)
  handleAddTeamAddedFailed(action, error) {
    this.error = error;
  }
}