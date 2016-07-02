/*
*/
import {PICTURE_ACTIONS} from './picture.service.actions';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {UrlFactory} from '../factories/url.factory';
/*
*/
import {ApplicationService} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('PictureService');
/*
*/
@inject(HttpClient, Dispatcher, UrlFactory, ApplicationService)
export class PictureService {

  constructor(httpClient, dispatcher, urlFactory, applicationService) {
    this.httpClient = httpClient;
    this.dispatcher = dispatcher;
    this.urlFactory = urlFactory;
    this.applicationService = applicationService;
  }

  retrievePicture(id, defaultPicture){

    let uri = this.urlFactory.build(`media/images/${id}`);
    
    this.httpClient.get(uri).then(
      response=> {
        let picture = 'data:image/png;base64,' + response;
        this.dispatcher.dispatch(PICTURE_ACTIONS.RETRIEVE_PICTURE, {id: id, picture: picture});
        
      },
      error=> this.dispatcher.dispatch(PICTURE_ACTIONS.RETRIEVE_PICTURE, {id: id, picture: defaultPicture}));
  }
}
