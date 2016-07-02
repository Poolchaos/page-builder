import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {WorkforceDashboardStore} from '../../workforce.dashboard.store';
/*
*/
const logger = LogManager.getLogger('ExpandedChartUtils');
/*
*/
@inject(WorkforceDashboardStore)
export class ExpandedChartUtils {

  constructor(workforceDashboardStore) {

    this.workforceDashboardStore = workforceDashboardStore;
  }

  setDatesForecast() {

    this.workforceDashboardStore.daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.setCurrentDay(this.workforceDashboardStore.daysOfWeek);

    this.getDates(dateObj=> {

      this.workforceDashboardStore.selectedDate = this.workforceDashboardStore.dates[0];
      this.workforceDashboardStore.selectedDayOfWeek = this.getSelectedDayOfWeek(this.workforceDashboardStore.selectedDate.dateObj, dateObj.getDay());

    });
  }

  getDates(callback) {

    var dateObj = new Date();
    var found = false;

    for (let i = 0; i < 7; i++) {

      if (i === 6 && this.workforceDashboardStore.dates.length < 6) {
        i = 0;
      } else if (this.workforceDashboardStore.dates.length === 6) {
        i = 7;
      }

      this.workforceDashboardStore.currentDayOfWeek = this.workforceDashboardStore.daysOfWeek[dateObj.getDay()];
      dateObj.setDate(dateObj.getDate() + 1);

      this.workforceDashboardStore.dates.push({
            dateObj: dateObj,
            dayOfWeek: this.getSelectedDayOfWeek(dateObj, dateObj.getDay()),
            dateText: dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear(),
            dateQuery: dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' +  dateObj.getDate()  //'2016-4-19'
          });

      this.workforceDashboardStore.dates[0].selected = true;

    }
     callback(dateObj);

  }

  setCurrentDay(daysOfWeek) {

    var dateObj = new Date();
    this.workforceDashboardStore.currentDayOfWeek = daysOfWeek[dateObj.getDay()];
  }

  getSelectedDayOfWeek(dateObj, currentDayOfWeek) {

    var selectedDay = this.workforceDashboardStore.daysOfWeek[dateObj.getDay()];
    var previousDay = this.workforceDashboardStore.daysOfWeek[dateObj.getDay() - 1];
    var currentDay = new Date();
    var tomorrowDay = new Date();
    currentDay = currentDay.getDay();
    tomorrowDay.setDate(tomorrowDay.getDate() + 1);
    tomorrowDay = tomorrowDay.getDay();

    if (tomorrowDay === currentDayOfWeek) {
      selectedDay = 'Tomorrow';
    }

    return selectedDay;

  }

}
