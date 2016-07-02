import {inject, LogManager} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {handle} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WRAP_UP_ACTIONS} from './wrapup.prompt.actions';
import {WrapUpPromptService} from './wrapup.prompt.service';
import {WrapUpPromptStore} from './wrapup.prompt.store';

const logger = LogManager.getLogger('WrapUpPrompt');

@inject(DialogController, WrapUpPromptService, WrapUpPromptStore, EventAggregator)
export class WrapUpPrompt {

  constructor(dialogController, wrapUpPromptService, wrapUpPromptStore, eventAggregator) {
    this.controller = dialogController;
    this.wrapUpPromptService = wrapUpPromptService;
    this.wrapUpPromptStore = wrapUpPromptStore;
    this.eventAggregator = eventAggregator;
  }

  activate() {
    this.eventAggregator.publish('hud.animator.blur.event');
    this.controller.settings.lock = false;
    this.initTicker();
  }

  deactivate(){

    clearInterval(this.ticker);
  }
  
  initTicker() {

    this.wrapUpPromptStore.time = {
      seconds: 0,
      minutes: 0
    };

    this.ticker = setInterval(()=> {
      var currTime = this.wrapUpPromptStore.time;
      currTime.seconds ++;

      if (currTime.seconds > 60) {
        currTime.seconds = 0;
        currTime.minutes++;
      }
      if (currTime.minutes > 60) {
        currTime.minutes = 0;
      }

      this.wrapUpPromptService.updateTime(currTime);
    }, 1000);
  }

  close() {
    this.controller.cancel();
  }

}
