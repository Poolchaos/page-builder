/*
*/
import {LogManager} from 'aurelia-framework';
import {ValidationRule} from 'aurelia-validation';
/*
*/
const logger = LogManager.getLogger('UniqueSkillGroupValidationRule');
/*
*/
export class UniqueSkillGroupValidationRule extends ValidationRule {

  constructor(skillGroups) {

    logger.debug('constructor > skillGroupName: ', skillGroups);
    
    super(skillGroups, onSkillGroupValidation, message);
  }
}
/*
*/
function onSkillGroupValidation(skillGroupName, skillGroups) {
  
  let allowedCharacters = new RegExp('^[(a-zA-Z0-9\s)-/&\\s]*$');
  
  for (let skillGroup of skillGroups) {
    if (skillGroup.skillGroupName.toLowerCase() === skillGroupName.toLowerCase()) {
      return false;
    }
  }
  
  
  return  allowedCharacters.test(skillGroupName);
}
/*
*/
function message() {

  return 'Please enter a unique name with no special characters.';
}