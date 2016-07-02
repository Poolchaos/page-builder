/*
*/
import {LogManager} from 'aurelia-framework';
import {ValidationRule} from 'aurelia-validation';
/*
*/
const logger = LogManager.getLogger('UniqueSkillValidationRule');
/*
*/
export class UniqueSkillValidationRule extends ValidationRule {

  constructor(skills) {
    
    super(skills, onSkillValidation, message);
  }
}
/*
*/
function onSkillValidation(skillName, skills) {
  
  let allowedCharacters = new RegExp('^[(a-zA-Z0-9\s)-/&\\s]*$');
  
  for (let skill of skills) {
    if (skill.skillName.toLowerCase() === skillName.toLowerCase()) {
      return false;
    }
  }  
  
  return allowedCharacters.test(skillName);
}
/*
*/
function message() {

  return 'Please enter a unique name with no special characters.';
}