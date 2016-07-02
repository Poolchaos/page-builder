/*
*/
import {PROMPT_ACTIONS} from './prompt.actions';
/*
*/
import {handle} from 'aurelia-flux';

let STATE = {

  width: null,
  icon: null,
  title: null,
  view: null,
  item: null,
  viewModel: null,
  items: null,
  searchField: null,
  settings: null,
  acceptAction: null
};

export class PromptStore {

  get width() {
    return STATE.width;
  }
  
  get icon() {
    return STATE.icon;
  }

  get title() {
    return STATE.title;
  }

  get view() {
    return STATE.view;
  }

  get item() {
    return STATE.item;
  }

  get viewModel() {
    return STATE.viewModel;
  }

  get items() {
    return STATE.items;
  }

  get rule() {
    return STATE.rule;
  }
  
  get display() {
    return STATE.display;
  }

  get settings() {
    return STATE.settings;
  }
  
  get acceptAction() {
    return STATE.acceptAction;
  }

  @handle(PROMPT_ACTIONS.RETRIEVE_PROMPT)
  handleRetrievePrompt(action, model) {
    //    STATE.width = '760px'; //  model.width;
    STATE.width = model.width;
    STATE.icon = model.icon;
    STATE.title = model.title;

    STATE.view = model.view;
    STATE.item = model.item;

    STATE.viewModel = model.viewModel;
    STATE.items = model.items;
    STATE.rule = model.rule;
    
    STATE.display = model.display;

    STATE.settings = model.settings;
    
    STATE.acceptAction = model.acceptAction;
  }
}
