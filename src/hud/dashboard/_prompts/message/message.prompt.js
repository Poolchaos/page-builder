/*
*/
import {HUD_ANIMATOR_EVENTS} from '../../../hud.animator.events';
import {PROMPT_ACTIONS} from '../prompt.actions';
/*
*/
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogController} from 'aurelia-dialog';
/*
*/
import {PromptStore} from '../prompt.store';
import {PromptService} from '../prompt.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('MessagePrompt');
/*
*/
@inject(PromptStore, PromptService, Dispatcher, EventAggregator, DialogController)
export class MessagePrompt {

  constructor(promptStore, promptService, dispatcher, eventAggregator, dialogController) {

    this.promptStore = promptStore;
    this.promptService = promptService;
    this.dispatcher = dispatcher;
    this.eventAggregator = eventAggregator;
    this.dialogController = dialogController;
  }

  attached() {
  }

  selectPicture(evt) {
  }

  accept() {
    this.promptService.actionItem(this.promptStore.acceptAction);
    this.dialogController.close();
    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.PROMPT_CLOSED);

  }

}
