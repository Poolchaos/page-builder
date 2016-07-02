/*
*/
import {customElement, inject, bindable, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
const logger = LogManager.getLogger('Wizard');
/*
*/
@customElement('wizard')
@inject(Router)
export class Wizard {

  @bindable intercept;

  steps = [];

  constructor(router) {

    this.router = router;
  }

  bind() {

    logger.debug('bind > this.router = ', this.router);

    for (let route of this.router.routes) {

      if (route.route === '') {
        continue;
      }

      this.steps.push({
        active: this.router.currentInstruction.fragment === route.route ? true : false,
        icon: `target/_assets/img/icon_${route.icon ? route.icon : route.route}.png`,
        label: route.route.toUpperCase(),
        description: route.title,
        route: route.route
      });
    }
  }

  getStepIndexOf(stepRoute) {

    for (let i = 0; i < this.router.routes.length; i++) {

      let route = this.router.routes[i];

      if (stepRoute === route.route) {
        return i;
      }
    }

    return -1;
  }

  get currentStepIndex() {
    
    return this.getStepIndexOf(this.router.currentInstruction.fragment);
  }

  get isPrevFaded() {

    return this.currentStepIndex === 1;
  }

  get isNextFaded() {

    return this.isPrevFaded === false && this.isDoneFaded === false;
  }

  get isDoneFaded() {

    return this.currentStepIndex < this.router.routes.length - 1;
  }

  get nextRoute() {

    return this.router.routes[this.currentStepIndex + 1].route;
  }

  get prevRoute() {

    return this.router.routes[this.currentStepIndex - 1].route;
  }

  stepNext() {

    this.isAllowed('next') && this.router.navigate(this.nextRoute);
  }

  stepPrev() {

    this.isAllowed('prev') && this.router.navigate(this.prevRoute);
  }

  stepBack() {

    this.isAllowed('back') && this.router.navigate('');
  }

  stepDone() {

    this.isAllowed('done') && this.router.navigate('');
  }

  isAllowed(step) {

    let isStepAllowed = true;

    if (this.intercept && this.intercept[step]) {

      isStepAllowed = this.intercept[step]();
    }

    return isStepAllowed;
  }

  selectStep(selectedStep) {
    
    let selectedStepIndex = this.getStepIndexOf(selectedStep.route);

    for (let step of this.steps) {
      
      let stepIndex = this.getStepIndexOf(step.route);
      
      step.completed = stepIndex < selectedStepIndex ? true : false;
      step.active = false;
    }

    selectedStep.active = true;
    this.router.navigate(selectedStep.route);
  }
}
