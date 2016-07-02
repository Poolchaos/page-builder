import {handle} from 'aurelia-flux';
import {WRAP_UP_ACTIONS} from './wrapup.prompt.actions';

export class WrapUpPromptStore {

  time = {
    seconds : 0,
    minutes: 0
  };
  
  @handle(WRAP_UP_ACTIONS.UPDATE_TIME)
    handleUpdateTime(message, time) {
      this.time = time;
  };

}