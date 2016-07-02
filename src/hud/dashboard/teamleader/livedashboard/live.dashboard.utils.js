export class LiveDashboardUtils {

  //
  // Returns the current date & time and as well as formatted date for query
  getCurrentDateTime() {
    var dateObj = new Date();
    var am_pm = (dateObj.getHours() < 12) ? 'am' : 'pm';
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var currentMonthName = monthNames[dateObj.getMonth()];
    var currMin = (dateObj.getMinutes() < 10) ? '0' + dateObj.getMinutes() : dateObj.getMinutes(); // add 0 if minutes is smaller than 10
    var currSec = (dateObj.getSeconds() < 10) ? '0' + dateObj.getSeconds() : dateObj.getSeconds(); // add 0 if minutes is smaller than 10
    var queryMonth = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
    var queryDate = dateObj.getFullYear() + '' + queryMonth + '' + (dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate());

    return {
      queryDate: queryDate,
      date: dateObj.getDate() + ' ' + currentMonthName + ' ' + dateObj.getFullYear(),
      time: dateObj.getHours() + ':' + currMin + ':' + currSec + am_pm
    };
  }

  //
  // Returns the current date (yyyymmdd)
  getCurrentDate() {
    Date.prototype.yyyymmdd = function () {
      var yyyy = this.getFullYear().toString();
      var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
      var dd = this.getDate().toString();
      return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
    };
    var d = new Date();
    return d.yyyymmdd();
  }

  //
  // Converts milliseconds to a readable format
  convertMillisecondsToTime(ms) {
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

  //
  // Calculates heights for the bar chart bars
  calculateBarChartBarHeights(waitTimeBreakdown) {
    var maxBarHeight = 230;
    var formattedData = [];
    for (var wt in waitTimeBreakdown) {
      var persentage = Number(waitTimeBreakdown[wt].waitTimePercentage).toFixed(0);
      var barHeight = (maxBarHeight / 100) * waitTimeBreakdown[wt].waitTimePercentage;
      waitTimeBreakdown[wt].waitTimePercentage = persentage;
      waitTimeBreakdown[wt].barHeight = barHeight;
      formattedData.push(waitTimeBreakdown[wt]);
    }
    return formattedData;
  }

}