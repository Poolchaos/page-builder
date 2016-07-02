import {inject} from 'aurelia-framework';
import {ValidationRule} from 'aurelia-validation';
import {ApplicationService} from 'zailab.common';

@inject(ApplicationService)
export class UniqueFormNameValidationRule extends ValidationRule {

  constructor(applicationService) {
    super(applicationService, onValidateFormName, message);
  }
}

function onValidateFormName(newValue, applicationService) {
  return applicationService.formNameSearch(newValue).then(response=>{

    let isUnique = true;

    for(let form of response){

      if(form.name.toLowerCase() === newValue.toLowerCase()){
        isUnique = false;
      }
    }

    return isUnique;

  });
}

function message(newValue, applicationService) {
  return `needs to be be unique, ${newValue} already exists`;
}