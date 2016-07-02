import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {JoinStore} from './join.store';

@inject(Router, JoinStore)
export class Join {
  
  constructor(router, joinStore) {
    
    this.router = router;
		this.joinStore = joinStore;
  }

  navTo() {
    this.router.navigate('login');
  }
  
}