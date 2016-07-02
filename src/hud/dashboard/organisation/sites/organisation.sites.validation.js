/*
*/
import {LogManager} from 'aurelia-framework';
import {ValidationRule} from 'aurelia-validation';
/*
*/
const logger = LogManager.getLogger('UniqueSiteValidationRule');
/*
*/
export class UniqueSiteValidationRule extends ValidationRule {

  constructor(sites) {
    
    super(sites, onSiteValidation, message);
  }
}
/*
*/
function onSiteValidation(siteName, sites) {
  for (let site of sites) {
    if (site.siteName.toLowerCase() === siteName.toLowerCase()) {
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