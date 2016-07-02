/*
*/
import {ORGANISATION_MENU_ACTIONS} from './organisation.menu.actions';
import {ORGANISATION_MENU_ITEMS} from '../organisation.menu.items';
/*
*/
import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
@inject(Dispatcher)
export class OrganisationMenuService {

  constructor(dispatcher) {

    this.dispatcher = dispatcher;
  }

  retrieveMenu() {

    let menu = ORGANISATION_MENU_ITEMS;

    this.dispatcher.dispatch(ORGANISATION_MENU_ACTIONS.RETRIEVE_ORGANISATION_MENU, menu);
  }
}
