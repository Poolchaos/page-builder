import { Toolkit } from './_common/toolkit'

export class AppModel {

  constructor() {

    this.routeMap = new Map();
    this.toolkit = new Toolkit();
    this.init();
  }

  init() {

    this.makeRoute('Welcome', false, true);
    this.makeRoute('Login', true, false);
    this.makeRoute('Register', true, false);
    this.makeRoute('Verify', false, false);
    this.makeRoute('Agent', false, false);
  }

  makeRoute(title, isNav, isRoot) {
    
    let name = title.toLowerCase();
    this.routeMap.set(name, this.toolkit.toJson(new Route(title, name, isNav, isRoot)));
  }
  
  routes(){
    
    return this.toolkit.toArray(this.routeMap.values());
  }
}

class Route {

  constructor(title, name, isNav, isRoot) {

    this.route = isRoot ? ['', name] : name;
    this.name = name;
    this.moduleId = name + '/' + name;
    this.nav = isNav;
    this.title = title;
  }
}
