import {inject} from 'aurelia-framework';
import {ValidationRule} from 'aurelia-validation';
import {ApplicationService} from '../../../_common/services/application.service';

@inject(ApplicationService)
export class UniqueUsernameValidationRule extends ValidationRule {

  constructor(applicationService) {
    super(applicationService, onValidateUsername, message);
  }
}

@inject(ApplicationService)
export class UniqueEmailValidationRule extends ValidationRule {

  constructor(applicationService) {
    super(applicationService, onValidateEmail, message);
  }
}

function onValidateUsername(newValue, applicationService) {
  return applicationService.validateUserUsername(newValue);
}

function onValidateEmail(newValue, applicationService) {
  
  return true;
}

function message(newValue, applicationService) {
  return `Needs to be be unique, ${newValue} already exists.`;
	
}
