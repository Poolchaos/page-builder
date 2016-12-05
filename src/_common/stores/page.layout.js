/**
 * Created by pjvanderberg on 11/1/2016.
 */
export const PAGE_LAYOUT = {
  display: 'components',
  active: true,
  items: [{
    eventId: 'incomingCall',
    name: 'Start',
    type: 'startEvent',
    group: '',
    controller: 'IncomingCallModalController',
    hasPopup: true,
    nodeIcon: 'startFlow_icon.png',
    properties: {
      name: '',
      numbers: [],
      callback: ''
    }
  }, {
    eventId: 'publicHolidays',
    name: 'Public Holidays',
    type: 'intermediateEvent',
    group: '',
    controller: 'PublicHolidaysModalController',
    hasPopup: true,
    nodeIcon: 'publicHoliday_icon.png',
    properties: {
      publicHolidays: []
    }
  }, {
    eventId: 'officeHours',
    name: 'Office Hours',
    type: 'intermediateEvent',
    group: '',
    controller: 'OfficeHoursModalController',
    hasPopup: true,
    nodeIcon: 'office_icon.png',
    properties: {
      daysOfWeek: {}
    }
  }]
};