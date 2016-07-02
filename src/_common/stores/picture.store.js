/*
*/
import {PICTURE_ACTIONS} from '../services/picture.service.actions';
/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/

const logger = LogManager.getLogger('PictureStore');
/*
*/
let STATE = {
  pictures: {}
};
/*
*/
export class PictureStore {
  
  get pictures() {
    return STATE.pictures;
  }

  @handle(PICTURE_ACTIONS.RETRIEVE_PICTURE)
  handleRetrievePicture(action, data) {

    let id = data.id;
    let picture = data.picture;
    
    STATE.pictures[id] = picture;
  }  
}