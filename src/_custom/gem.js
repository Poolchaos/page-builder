/*
*/
import {customElement} from 'aurelia-framework';
import $ from 'jquery';
/*
*/
@customElement('gem')
export class Gem {
  
  attached() {
    
    let button = this.gem;
    
    let buttonWidth = $(button).width();
    let buttonHeight = 100/86.1 * buttonWidth + 'px';
    
    $('button').height(buttonHeight);
    
//    logger.debug('buttonWidth > ', buttonWidth);
//    logger.debug('buttonHeight > ', buttonHeight);
  }
}