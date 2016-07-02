/*
*/
import {LogManager} from 'aurelia-framework';
import {ValidationRule} from 'aurelia-validation';
/*
*/
const logger = LogManager.getLogger('UniqueServiceValidationRule');
/*
*/
export class UniqueServiceValidationRule extends ValidationRule {

  constructor(services) {

    super(services, onServiceValidation, message);
  }
}
/*
*/
function onServiceValidation(serviceName, services) {
  
  for (let service of services) {
    if (service.serviceName.toLowerCase() === serviceName.toLowerCase()) {
      return false;
    }
  }

  return true;
}
/*
*/
function message() {

  return 'Please enter a unique name.';
}
