/*
*/
import {OrganisationMenuStore} from './organisation.menu.store';
/*
*/
import {inject} from 'aurelia-framework';
/*
*/
@inject(OrganisationMenuStore)
export class OrganisationMenuConfig {

  constructor(organisationMenuStore) {

    this.organisationMenuStore = organisationMenuStore;
  }

  get helmViewModel() {

    return 'hud/dashboard/organisation/menu/organisation.menu.helm';
  }

  get portItems() {

//    let items = [];
//
//    for (let item of this.organisationMenuStore.menu.port) {
//
//      let name = item.option.route;
//      item.viewModel = `hud/dashboard/organisation/menu/${name}/${name}`;
//      items.push(item);
//    }
//
//    return items;
    
    addViewModel(this.organisationMenuStore.menu.port);
    return this.organisationMenuStore.menu.port;
  }

  get starboardItems() {

//    let items = [];
//
//    for (let item of this.organisationMenuStore.menu.starboard) {
//
//      let name = item.option.route;
//      item.viewModel = `hud/dashboard/organisation/menu/${name}/${name}`;
//      items.push(item);
//    }
//
//    return items;
    
    addViewModel(this.organisationMenuStore.menu.starboard);
    return this.organisationMenuStore.menu.starboard;
  }
}


/*
*/
function addViewModel(items) {

  for (let item of items) {

    let name = item.option.route;
    item.viewModel = `hud/dashboard/organisation/menu/${name}/${name}`;
  }
}
