import {inject} from 'aurelia-framework';
import {MODEL} from '../../_api/model';
import {UrlFactory} from '../factories/url.factory';

@inject(UrlFactory)
export class ApiFactory {

  constructor(urlFactory) {
    this.urlFactory = urlFactory;
  }

  getModelItem(type, name) {
    var item = MODEL[type][name];
    if (!item) {
      throw new Error('No item found for ' + name + ' in ' + type + '. Is it in the api constant?\r\n\r\n' + JSON.stringify(MODEL) + '\r\n\r\n');
    }
    return item;
  }

  getCommand(name) {
    return this.getModelItem('commands', name);
  }

  getEvent(name) {
    return this.getModelItem('events', name);
  }

  getQuery(name) {
    return this.getModelItem('queries', name);
  }

  getUpdate(name) {
    return this.getModelItem('updates', name);
  }

  buildCommand(name, payload) {
    var message = this.getCommand(name);
    return {
      feature: message.root,
      name: message.typeId,
      state: payload
    };
  }

  buildEvent(name, callback) {
    var message = this.getEvent(name);
    return {
      name: message.typeId,
      callback: callback
    };
  }
  
  buildQuery(name, params) {
    
    let query = this.getQuery(name);
    
    let search = '';
    for(let param of query.params){
      if(search.length > 0){
        search += '&';
      }
      search += param + '=' + params[param];
    }

    return this.urlFactory.build(query.path, search);    
  }
  
  buildUpdate(name) {
    
    let update = this.getUpdate(name);

    return this.urlFactory.build(update.path);    
  }
}