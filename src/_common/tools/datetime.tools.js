import {LogManager} from 'aurelia-framework';
/*
*/
import moment from 'moment-timezone';
/*
*/
const logger = LogManager.getLogger('DateTimeTools');
/*
*/
export class DateTimeTools {

  convertToLocalTime(sourceTime, sourceZone) {

    let localTime = moment.tz(sourceTime, sourceZone)._d;
    let formattedDate = localTime.getFullYear() + '-' + (localTime.getMonth() + 1) + '-' + localTime.getDate();
    let formattedTime = (localTime.getHours() < 10 ? '0' + localTime.getHours() : localTime.getHours()) + ':' +  (localTime.getMinutes() < 10 ? '0' + localTime.getMinutes() : localTime.getMinutes());
    let dateObj = localTime;

    return {date: formattedDate, time: formattedTime, dateObj: dateObj};
  }

  convertMillisecondsToTime(ms) {

    if(!ms) {
      return '0m 0s';
    }

    if (ms.toString().indexOf('s') > -1) // Check if time already formatted
      return ms;
    var x, time, days, hours, minutes, seconds;
    x = Math.floor(ms / 1000);
    seconds = Math.floor(x % 60);
    x /= 60;
    minutes = Math.floor(x % 60);
    x /= 60;
    hours = Math.floor(x % 24);
    x /= 24;
    days = x;
    time = minutes + 'm ' + seconds + 's';
    return time;
  }

}
