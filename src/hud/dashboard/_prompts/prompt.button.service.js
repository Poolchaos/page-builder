/*
*/
import $ from '../../../../jspm_packages/npm/jquery@2.1.4';
/*
*/
import {LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('PromptButtonService');
/*
*/
export class PromptButtonService {
  
  interceptEnterKey(props) {
    
    for (let prop of props) {
      
      let itemId = `#item-${prop}`;

      $(itemId).on('keyup', function (event) {
        
        if (event.keyCode == 13) {
          $("#acceptBtn").click();
        }
      });
    }
  }
}
