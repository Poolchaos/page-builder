export class SortTools {

  static compareBy(prop) {

    return function(o1, o2) {
      
      if (typeof o1[prop] === 'number' && typeof o2[prop] === 'number') {
        return (o1[prop] > o2[prop]) ? 1 : ((o1[prop] < o2[prop]) ? -1 : 0);
      } else {
        return (o1[prop] !== null && o2[prop] !== null && o1[prop].toLowerCase() > o2[prop].toLowerCase()) ? 1 : ((o1[prop] !== null && o2[prop] !== null && o1[prop].toLowerCase() < o2[prop].toLowerCase()) ? -1 : 0);
      }

    };
  }

}
