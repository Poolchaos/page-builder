/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {ensure, Validation}from 'aurelia-validation';
/*
 */
import {CreateStore} from '../../create.store';
import {CreateService} from '../../create.service';
import {UniqueFormNameValidationRule} from '../../createformvalidation';
/*
 */
const logger = LogManager.getLogger('FormName');
/*
 */
import uuid from 'node-uuid';


@inject(Router, CreateStore, CreateService, UniqueFormNameValidationRule, Validation)
export class Name {


  constructor(router, createStore, createService, uniqueFormNameValidationRule, validation){

    this.router = router;
    this.createStore = createStore;
    this.createService = createService;
    this.uniqueFormNameValidationRule = uniqueFormNameValidationRule;
    this.validation = validation.on(this)
        .ensure('createStore.formName', config => {config.useDebounceTimeout(150);})
        .isNotEmpty().withMessage('Please enter your form name.').isNotEmpty().withMessage('Please enter a name for this form.')
        .passesRule(this.uniqueFormNameValidationRule).matches(/^([\w]+[\W]*)+$/) // /^([a-zA-Z-0-9.\s])+$/
        .withMessage((newValue, threshold) => {return `Is not a valid input.`;})
        .ensure('createStore.passRequirement').isNotEmpty().withMessage('Please enter a pass rate for this form.').isNumber().withMessage('The pass rate can only contain numbers.').isGreaterThan(-1).withMessage('The pass rate must be between 0 and 100.').isLessThan(101).withMessage('The pass rate must be between 0 and 100.')
  }

  attached(){
    this.createService.retrievePersonalInfo();
    setTimeout(() => {

      this.setFocus('formName');
    }, 800);
  }

  setFocus(field) {

    let firstElement = document.getElementById(field);
    if (firstElement !== null) {
      firstElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus(field);
      }, 100);
    }
  }

  cancel(){

    this.router.navigateBack();
    this.createService.clearState();
  }

  createForm(){
    this.createStore.formId = uuid.v4();
    this.validation.validate()
        .then(() => {
          this.router.navigate('questions');
        })
        .catch((error) => {

          logger.debug('error >', error);
        });

  }

}
