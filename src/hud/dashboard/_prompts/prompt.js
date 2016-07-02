/*
*/
import {PROMPT_ACTIONS} from './prompt.actions';
import {PromptService} from './prompt.service';
import {PromptStore} from './prompt.store';
import {PromptButtonService} from './prompt.button.service';
import {WindowService} from '../../../_common/services/window.service';
import {WINDOW_EVENTS} from '../../../_common/services/window.service.events';
import {HUD_ANIMATOR_EVENTS} from '../../hud.animator.events';
/*
*/
import {inject, LogManager, BindingEngine} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {handle, waitFor} from 'aurelia-flux';
import {Validation} from 'aurelia-validation';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('Prompt');
const RESERVED_PROPERTIES = ['id', 'isMarked', 'isSelected', 'isDisabled', 'isPassword', 'customMessage'];
/*
*/
const CUSTOM_TYPES = {
  EMAIL: {
    NAME: '_email_name_',
    DOMAIN: '_email_domain_'
  }
};
/*
*/
@inject(WindowService, PromptButtonService, PromptService, PromptStore, DialogController, Validation, EventAggregator, BindingEngine)
export class Prompt {

  item = null;
  props = null;
  types = null;
  rendered = false;
  openPromptClass = null;
  errors = null;

  resolve = null;

  emailNamePropertyObserverSubscription = null;

  constructor(windowService, promptButtonService, promptService, promptStore, dialogController, validation, eventAggregator, bindingEngine) {

    this.windowService = windowService;
    this.promptButtonService = promptButtonService;

    this.promptService = promptService;
    this.promptStore = promptStore;
    this.controller = dialogController;
    this._validation = validation;
    this.eventAggregator = eventAggregator;

    this.bindingEngine = bindingEngine;

    eventAggregator.subscribe(HUD_ANIMATOR_EVENTS.PROMPT_OPENED, () => { // close this prompt when another prompt is opened
      if(this.controller) {
        this.controller.close(false, new Error('Another prompt opened'));
      }
    });

    eventAggregator.subscribe('router:navigation:processing', () => { // close this prompt when navigating
      if(this.controller) {
        this.controller.close(false, new Error('Router navigated'));
      }
    });

    let currentMessage = {};
    let getProp = (data) => {

      let event = data.event;

      if (!event.target.id || !event.target.id.split || event.target.id.split('-').length < 2) {
        return;
      }

      let prop = event.target.id.split('-')[1]; // get the prop name from the id

      return prop;
    };

    eventAggregator.subscribe(WINDOW_EVENTS.ON_CAPSLOCK_DETECTED, (data) => { // TODO this gets called for every key event - not safe

      let prop = getProp(data);

      if (!this.errors) {
        this.errors = {};
      }

      currentMessage[prop] = this.errors[prop] === data.settings.message ? currentMessage[prop] || '' : this.errors[prop] || '';
      this.errors[prop] = data.settings.message;
    });

    eventAggregator.subscribe(WINDOW_EVENTS.OFF_CAPSLOCK_DETECTED, (data, event) => { // TODO this gets called for every key event - not safe

      let prop = getProp(data);

      if (this.errors && this.errors[prop] === data.settings.message) {

        this.errors[prop] = '';
      }
    });

    //    eventAggregator.subscribe(WINDOW_EVENTS.ON_CAPSLOCK_DETECTED, (data) => { // show capslock message
    //
    //      let event = data.event;
    //
    //      if (!event.target.id || !event.target.id.split || event.target.id.split('-').length < 2) {
    //        return;
    //      }
    //
    //      let settings = data.settings;
    //
    //      let prop = event.target.id.split('-')[1]; // get the prop name from the id
    //
    //      if (!this.errors) {
    //        this.errors = {};
    //      }
    //
    //      let currentMessage = this.errors[prop];
    //      this.errors[prop] = settings.message;
    //
    //      setTimeout(() => { // remove the error message after a while
    //
    //        if (this.errors && this.errors[prop] === settings.message) {
    //          this.errors[prop] = currentMessage ? currentMessage : '';
    //        }
    //      }, settings.duration);
    //    });

    this.controller.settings.lock = false;
  }

  get isView() {
    return this.promptStore.view !== undefined;
  }

  get isViewModel() {
    return this.promptStore.viewModel !== undefined;
  }

  get showSeperator() {

    for (let prop in this.item) {
      if (this.isVisibleProperty(prop)) {
        return true;
      }
    }

    return false;
  }

  get showAccept() {

    if (!this.promptStore.settings) {
      return true;
    }
  }

  get isSelectNoneRuleEnabled() {

    if (this.promptStore.settings.select && //
        this.promptStore.settings.select.rule && //
        this.promptStore.settings.select.rule.selectNone && //
        this.promptStore.settings.select.rule.selectNone.enabled) {

      return true;
    }

    return false;
  }

  canActivate(model) {

    this.rendered = false;

    this.promptService.retrievePrompt(model);

    return new Promise((resolve) => this.resolve = resolve);
  }

  attached() {

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        this.promptService.attached(this.controller);

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 150);

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        this.promptButtonService.interceptEnterKey(this.props);

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 300);

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        let itemId = null;

        for (let prop of this.props) {

          if (RESERVED_PROPERTIES.indexOf(prop) === -1 && this.types[prop] !== 'email') {
            itemId = `item-${prop}`;
            break;
          }
        }

        let fisrtElement = document.getElementById(itemId);
        if (fisrtElement !== null) {
          fisrtElement.focus();
        }

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 700);
  }

  center() {

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        if(!this.controller || !this.controller.centerDialog || typeof this.controller.centerDialog !== 'function') return;
        this.controller.centerDialog();

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 50);

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        if(!this.controller || !this.controller.centerDialog || typeof this.controller.centerDialog !== 'function') return;
        this.controller.centerDialog();

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 100);

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        if(!this.controller || !this.controller.centerDialog || typeof this.controller.centerDialog !== 'function') return;
        this.controller.centerDialog();

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 150);

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        if(!this.controller || !this.controller.centerDialog || typeof this.controller.centerDialog !== 'function') return;
        this.controller.centerDialog();

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 200);

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        if(!this.controller || !this.controller.centerDialog || typeof this.controller.centerDialog !== 'function') return;
        this.controller.centerDialog();

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 250);

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        if(!this.controller || !this.controller.centerDialog || typeof this.controller.centerDialog !== 'function') return;
        this.controller.centerDialog();

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 300);

    setTimeout(() => { // TODO find the hook that executes on vm loaded - bind is to early (possibly because of the compose)
      try {

        if(!this.controller || !this.controller.centerDialog || typeof this.controller.centerDialog !== 'function') return;
        this.controller.centerDialog();

      } catch (exception) {
        logger.error('attached > error = ', exception);
      }
    }, 350);
  }

  @handle(PROMPT_ACTIONS.RETRIEVE_PROMPT)
  @waitFor(PromptStore)
  handleRetrievePrompt(action, model) {

    this.windowService.disableDoubleClick();
    this.windowService.enableCapslockDetection();

    this.item = this.promptStore.item;

    if (this.promptStore.item) {
      this.customMessage = this.promptStore.item.customMessage;
      this.isPassword = this.promptStore.item.isPassword;
      this.isName = this.promptStore.item.isName;
    }
    //TODO: Find a way to use generic validation (with a callback?)
    this.passwordValidation = this._validation.on(this.item);
    this.nameValidation = this._validation.on(this.item);
    this.validation = this._validation.on(this.item);

    this.types = {};
    let props = [];
    for (let prop in this.item) {

      let type = null;
      if (model.type && model.type[prop]) {
        type = model.type[prop];
      }

      this.types[prop] = type;

      let rule = null;
      if (model.rule && model.rule[prop]) {
        rule = model.rule[prop];
      }

      if (this.isVisibleProperty(prop)) {

        if (this.isPassword) {

          this.item[prop] = '';
          this.validatePassword = this.passwordValidation.ensure('new').isNotEmpty().hasLengthBetween(8, 50).withMessage('Must be between 8 and 50 characters long.').containsNoSpaces().withMessage('Password cannot contain spaces.').isStrongPassword().withMessage('Must contain at least one lowercase, one uppercase and one number or special character.')
                .isEqualTo(() => {
                  return this.item.confirm;
                }, 'the entered password').withMessage('Your passwords do not match.');
        }

        if (this.isName) {

          this.validateName = this.nameValidation.ensure('firstName').isNotEmpty().hasLengthBetween(2, 30).withMessage('Must be between 2 and 30 characters long.').matches(/^([a-zA-Z-\s])+$/).withMessage('Is not valid.').ensure('surname').isNotEmpty().hasLengthBetween(2, 30).withMessage('Must be between 2 and 30 characters long.').matches(/^([a-zA-Z-\s])+$/).withMessage('Is not valid.');

        }

        if (prop !== 'isName' && prop !== 'isPassword') {

          props.push(prop);
          this.validation = this.validation.ensure(prop).isNotEmpty().withMessage('Please do not leave this blank.');
        }

        if (type !== null) {

          switch (type) {
            case 'email':

              this.validation.ensure(prop)
                .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                .withMessage('Field cannot be blank. Domain must contain a full stop and cannot contain special characters.');

              // check if valid and then set the respective email values
              let setEmailItem = (value) => {

                if (value) {

                  let split = value.split('@');
                  if (split && split.length === 2) {

                    let nameValue = this.item[CUSTOM_TYPES.EMAIL.NAME] === '@' ? '' : this.item[CUSTOM_TYPES.EMAIL.NAME];

                    this.item[CUSTOM_TYPES.EMAIL.NAME] = split[0] || nameValue;
                    this.item[CUSTOM_TYPES.EMAIL.DOMAIN] = split[1] || this.item[CUSTOM_TYPES.EMAIL.DOMAIN];
                  }
                }
              };

              // add special properties for custom email type
              props.push(CUSTOM_TYPES.EMAIL.NAME);
              props.push(CUSTOM_TYPES.EMAIL.DOMAIN);

              this.item[CUSTOM_TYPES.EMAIL.NAME] = '';
              this.item[CUSTOM_TYPES.EMAIL.DOMAIN] = '';

              if (this.emailNamePropertyObserverSubscription === null) {
                this.emailNamePropertyObserverSubscription = this.bindingEngine.propertyObserver(this.item, CUSTOM_TYPES.EMAIL.NAME).subscribe((newValue, oldValue) => {

                  if (newValue.indexOf('@') !== -1) {

                    setEmailItem(newValue);

                    let domainElement = document.getElementById(`item-${CUSTOM_TYPES.EMAIL.DOMAIN}`);
                    if (domainElement !== null) {
                      domainElement.select ? domainElement.select() : domainElement.focus();
                    }
                  }
                });
              }

              let value = this.item[prop];
              setEmailItem(value);

              break;
          }
        }

        if (rule !== null) {
          this.validation = this.validation.ensure(prop).passesRule(rule);
        }
      }
    }

    this.props = props;

    this.rendered = true;

    //    this.promptService.attached(this.controller);

    this.center();

    if (this.resolve !== null) {
      this.resolve(true);
      this.resolve = null;
    }
  }

  isTypeText(prop) {

    return this.types[prop] !== 'email' && [CUSTOM_TYPES.EMAIL.NAME, CUSTOM_TYPES.EMAIL.DOMAIN].indexOf(prop) === -1;
  }

  isTypeEmail(prop) {

    return this.types[prop] === 'email';
  }

  validate() {

    this.errors = {};

    if (this.promptStore.items) {

      let itemSelected = false;

      for (var item of this.promptStore.items) {

        if (item.isSelected) {

          itemSelected = true;
        }
      }

      if (!itemSelected && this.isSelectNoneRuleEnabled === false) {

        this.errors.noSelection = 'Please select at least 1 item.';
        return;
      }
    }

    // reset the email property if found
    for (let prop of this.props) {

      if (this.isTypeEmail(prop)) {

        let emailName = this.item[CUSTOM_TYPES.EMAIL.NAME] ? this.item[CUSTOM_TYPES.EMAIL.NAME] : '';
        let emailDomain = this.item[CUSTOM_TYPES.EMAIL.DOMAIN] ? this.item[CUSTOM_TYPES.EMAIL.DOMAIN] : '';

        this.item[prop] = `${emailName}@${emailDomain}`;
      }
    }

    this.validation.validate()
      .then(() => {

        if (this.promptStore.item && this.promptStore.item.isPassword) {
          this.validatePassword.validate()
            .then(() => {
              this.controller.ok();
            })
            .catch((error) => {
              for (let prop in error.properties) {
                this.errors[prop] = error.properties[prop].message;
              }
            });

        } else if (this.promptStore.item && this.promptStore.item.firstName) {
          this.nameValidation.validate()
            .then(() => {
              this.controller.ok();
            })
            .catch((error) => {
              for (let prop in error.properties) {
                this.errors[prop] = error.properties[prop].message;
              }
            });
        }  else {

          if (this.emailNamePropertyObserverSubscription) {
            this.emailNamePropertyObserverSubscription.dispose();
            this.emailNamePropertyObserverSubscription = null;
          }

          this.controller.ok();
        }

      })
      .catch((error) => {

        for (let prop in error.properties) {
          this.errors[prop] = error.properties[prop].message;
        }
      });
  }

  @handle('agentstatus.logged')
  handleStatusLogged(action, status) {
  
    logger.debug(' prompt received status change ');
    
    if(status === 'WRAP_UP') {
      
      this.eventAggregator.publish('hud.animator.blur.event');
      
      logger.debug(' status is wrapUp >>> close all other promts ');
      
      if(this.controller) {
        this.controller.close();
      }
    }
  }

  isVisibleProperty(prop) {

    return RESERVED_PROPERTIES.indexOf(prop) === -1;
  }

  getPlaceholder(prop) {

    let buffer = '';

    let length = prop.length;
    for (let i = 0; i < length; i++) {

      let char = prop[i];

      if (char === char.toUpperCase()) {

        buffer += ' ';
      }

      buffer += char.toLowerCase();
    }

    return buffer;
  }
}
/*
*/
function setWidth() {

  //  let storeWidth = this.promptStore.width;
  //  let styleWidth = this.frame.style.width;
  //
  //  logger.debug('setWidth > storeWidth = ', storeWidth);
  //  logger.debug('setWidth > styleWidth = ', styleWidth);
  //
  //  this.frame.style.width = storeWidth;
}
