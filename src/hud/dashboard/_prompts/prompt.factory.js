/*
*/
import {Prompt} from './prompt';
import {PROMPT_SETTINGS} from './prompt.settings';
/*
*/
import {LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('PromptFactory');
/*
*/
export class PromptFactory {

  buildFormPrompt(title, item, acceptAction, cancelAction) {

    let prompt = buildViewPrompt('hud/dashboard/_prompts/form/form.prompt.html');

    populate(prompt).with({
      promptModel: {
        title: title,
        item: item
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildMultiSelectPrompt(title, items, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/select/select.prompt', PROMPT_SETTINGS.SELECT_MULTI_ONLY);

    populate(prompt).with({
      promptModel: {
        title: title,
        items: items
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildMultiAutoSelectPrompt(title, items, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/select/select.prompt', PROMPT_SETTINGS.AUTO_SELECT_MULTI);

    populate(prompt).with({
      promptModel: {
        title: title,
        items: items
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildMultiSelectOnlyPrompt(title, items, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/select/select.prompt', PROMPT_SETTINGS.SELECT_MULTI_ONLY);

    populate(prompt).with({
      promptModel: {
        title: title,
        items: items
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildSingleSelectOnlyPrompt(title, items, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/select/select.prompt', PROMPT_SETTINGS.SELECT_ONE_ONLY);

    populate(prompt).with({
      promptModel: {
        title: title,
        items: items
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildEditDeletePrompt(title, items, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/select/select.prompt', PROMPT_SETTINGS.EDIT_DELETE);

    populate(prompt).with({
      promptModel: {
        title: title,
        items: items,
        width: 200
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildTabPrompt(title, items, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/tab/tab.prompt', PROMPT_SETTINGS.SELECT_MULTI_ONLY);

    populate(prompt).with({
      promptModel: {
        title: title,
        items: items
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildPicturePrompt(title, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/picture/picture.prompt', PROMPT_SETTINGS.PICTURE);

    populate(prompt).with({
      promptModel: {
        title: title
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildMessagePrompt(title, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/message/message.prompt', PROMPT_SETTINGS.MESSAGE);

    populate(prompt).with({
      promptModel: {
        title: title
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }

  buildCallPrompt(title, acceptAction, cancelAction) {

    let prompt = buildViewModelPrompt('hud/dashboard/_prompts/call/call.prompt', PROMPT_SETTINGS.CALL);

    populate(prompt).with({
      promptModel: {
        title: title
      },
      promptAcceptAction: acceptAction,
      promptCancelAction: cancelAction
    });

    return prompt;
  }
}
/*
*/
function populate(prompt) {

  return {

    with: (properties) => {

      for (let prop in properties) {

        let xProps = {};

        if (prompt[prop]) {
          xProps = prompt[prop];
        }

        prompt[prop] = properties[prop];

        for (let xProp in xProps) {

          prompt[prop][xProp] = xProps[xProp];
        }
      }
    }
  };
}
/*
*/
function buildViewPrompt(view) {

  let prompt = {

    promptViewModel: Prompt,

    promptModel: {
      icon: 'services',
      view: view
    }
  };

  return prompt;
}
/*
*/
function buildViewModelPrompt(viewModel, settings) {

  let prompt = {

    promptViewModel: Prompt,

    promptModel: {
      icon: 'services',
      viewModel: viewModel,
      settings: settings
    }
  };

  return prompt;
}
