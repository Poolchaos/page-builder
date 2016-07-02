/*
*/
import {LogManager, customElement, bindable} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('Steps');
/*
*/
@customElement('steps')
export class Picture {

  @bindable items;
  @bindable router;

   selectStep(step, stepIndex) {

     for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
       this.items[itemIndex].completed = itemIndex < stepIndex ? true : false;
       this.items[itemIndex].active = false;
     }

     step.active = true;
     this.router.navigate(step.route);

   }

}
