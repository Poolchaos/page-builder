/*
*/
import {HUD_ANIMATOR_EVENTS} from '../../hud.animator.events';
import {PROMPT_ACTIONS} from './prompt.actions';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {DialogService} from 'aurelia-dialog';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('PromptService');
/*
*/
@inject(Dispatcher, DialogService, EventAggregator)
export class PromptService {

  attachedCallback;

  constructor(dispatcher, dialogService, eventAggregator) {

    this.dispatcher = dispatcher;
    this.dialogService = dialogService;
    this.eventAggregator = eventAggregator;
  }

  onAttached(cb) {
    this.attachedCallback = cb;
  }

  attached(controller) {
    this.attachedCallback && this.attachedCallback(controller);
    this.attachedCallback = null;
  }

  retrievePrompt(model) {

    if (model.items) {

      for (let item of model.items) {

        item.isMarked = false;
      }
    }

    this.dispatcher.dispatch(PROMPT_ACTIONS.RETRIEVE_PROMPT, model);
  }

  openPrompt(option, prompts, index) {

    if (!option) {

      throw new Error('option must be provided, try PromptFactory.build...Prompt(title, item(s), acceptAction [, cancelAction]);');
    }

    if (!option.promptViewModel && !option.prompts) {

      //      logger.debug('openPrompt > no need to open prompt for option = ', option);

      return;
    }

    if (option.prompts) {

      let prompt = option.prompts[0]();

      if (prompt instanceof Promise) {

        prompt.then((_prompt) => {

          this.openPrompt(_prompt, option.prompts, 1);
        });
      } else {

        this.openPrompt(prompt, option.prompts, 1);
      }
    } else {

      let originalItems = null;
      let originalItem = null;
      if (option.promptModel.items) {
        originalItems = JSON.parse(JSON.stringify(option.promptModel.items));
      }
      if (option.promptModel.item) {
        originalItem = JSON.parse(JSON.stringify(option.promptModel.item));
      }

      option.promptModel.acceptAction = option.promptAcceptAction;

      this.dispatcher.dispatch(PROMPT_ACTIONS.OPEN_PROMPT, option);

      this.dialogService.open({viewModel: option.promptViewModel, model: option.promptModel})

        .then(response => {

          if (response.wasCancelled) {

            let isChainedPrompt = (index && index > 1 && index <= prompts.length);

            if (originalItems && isChainedPrompt === false) {

              for (let i in option.promptModel.items) {
                option.promptModel.items.pop();
              }

              for (let item of originalItems) {
                option.promptModel.items.push(item);
              }
            }

            if (originalItem) {

              option.promptModel.item = originalItem;
            }

            if (option.promptCancelAction && response.output === undefined) {

              this.dispatcher.dispatch(option.promptCancelAction, option.promptModel);
            }
          } else {

            this.dispatcher.dispatch(option.promptAcceptAction, option.promptModel);
          }

          if (index && index <= prompts.length) {

            if (response.wasCancelled) {

              if (index > 1) {

                let prompt = prompts[index - 2]();

                if (prompt instanceof Promise) {

                  prompt.then((_prompt) => {

                    this.openPrompt(_prompt, prompts, index - 1);
                  });
                } else {

                  this.openPrompt(prompt, prompts, index - 1);
                }
              } else {

                this.dispatcher.dispatch(PROMPT_ACTIONS.CLOSE_PROMPT, option);

                this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.PROMPT_CLOSED);
              }
            } else {

              if (option.promptModel.items) {

                for (let item of option.promptModel.items) {

                  if (item.isSelected) {

                    if (index < prompts.length) {

                      let prompt = prompts[index](item);

                      if (prompt instanceof Promise) {

                        prompt.then((_prompt) => {

                          this.openPrompt(_prompt, prompts, index + 1);
                        });
                      } else {

                        this.openPrompt(prompt, prompts, index + 1);
                      }
                    }
                    break;
                  }
                }
              } else {

                if (index < prompts.length) {

                  let prompt = prompts[index]();

                  if (prompt instanceof Promise) {

                    prompt.then((_prompt) => {

                      this.openPrompt(_prompt, prompts, index + 1);
                    });
                  } else {

                    this.openPrompt(prompt, prompts, index + 1);
                  }
                }
              }

              if (index >= prompts.length) {

                this.dispatcher.dispatch(PROMPT_ACTIONS.CLOSE_PROMPT, option);

                this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.PROMPT_CLOSED);
              }
            }
          } else {

            this.dispatcher.dispatch(PROMPT_ACTIONS.CLOSE_PROMPT, option);

            this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.PROMPT_CLOSED);
          }
        })
      ;
    }

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.PROMPT_OPENED);
  }

  actionItem(action, item) {

    this.dispatcher.dispatch(action, item);
  }
}
