import {LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('ArrayTools');

export class ArrayTools {

  static containsAll(a1, a2) {

    if (a1.length !== a2.length) {
      return false;
    }

    for (let i1 of a1) {

      if (a2.indexOf(i1) === -1) {
        return false;
      }
    }

    return true;
  }
}
