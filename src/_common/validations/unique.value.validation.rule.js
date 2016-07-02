/*
*/
import {ValidationRule} from 'aurelia-validation';
/*
*/
export class UniqueValueValidationRule extends ValidationRule {

  constructor(list) {

    super(list, onValidation, message);
  }
}
/*
*/
function onValidation(value, list) {
  
  for (let item of list) {
    if (item.toLowerCase() === value.toLowerCase()) {
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
