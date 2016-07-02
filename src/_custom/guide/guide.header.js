/*
*/
import {customElement, bindable, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('GuideHeader');
/*
*/
@customElement('guide-header')
export class GuideHeader {
  
  @bindable guide;

  bind() {
    
    logger.debug('bind > this.guide = ', this.guide);
  }
}