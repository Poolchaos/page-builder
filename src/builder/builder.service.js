/*
*/
import {Dispatcher} from 'aurelia-flux';
import {inject} from 'aurelia-framework';
/*
*/
import {BUILDER_ACTIONS} from './builder.actions';
/*
*/
@inject(Dispatcher)
export class BuilderService {
  
  constructor(dispatcher) {
    
    this.dispatcher = dispatcher;
  }
  
  addComponent(component) {
    
    this.dispatcher.dispatch(BUILDER_ACTIONS.GET_COMPONENT, component);
  }
}