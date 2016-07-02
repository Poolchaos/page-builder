/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Dispatcher} from 'aurelia-flux';
import {UserSession} from 'zailab.common';
/*
zailab
*/
import {WEATHER_ACTIONS} from './weather.actions';

const logger = LogManager.getLogger('WeatherService');

@inject(HttpClient, Dispatcher, UserSession)
export class WeatherService {
  
  constructor(httpClient, dispatcher, userSession) {
   
    this.httpClient = httpClient;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
  }
  
  getTemperature(latitude, longitude) {
      
    var date = new Date;
    var hours = date.getHours();
    
    if(this.userSession.temperature && this.userSession.temperature.hours === hours) {
//      this.styleCircle(this.userSession.temperature.temp);
      this.showWeather(this.userSession.temperature.weatherCode, this.userSession.temperature.temp);
      return;
    }
    
//    let appId = 'de30f0fee65b4650680268f41f224';
    let appId = 'acc751efcb054031a7ac937bfabce';
    let http = 'https';
    
//    this.httpClient.fetch(http + '://api.worldweatheronline.com/free/v2/weather.ashx?q=' + latitude + ',' + longitude + '&format=json&key=' + appId, {
    this.httpClient.fetch(http + '://api.worldweatheronline.com/premium/v1/weather.ashx?q=' + latitude + ',' + longitude + '&format=json&key=' + appId, {
      method: 'get'
    })
    .then(response => response.json())
    .then(response => {

      if(!response.data) {
        return;
      }
        
      let temp = response.data.current_condition[0].temp_C;
      
      this.userSession.temperature = {
        hours: hours,
        temp: temp,
        weatherCode: response.data.current_condition[0].weatherCode
      };
      
//      this.styleCircle(temp);
      this.showWeather(response.data.current_condition[0].weatherCode, temp);
      
    });
  }
  
  showWeather(weatherCode, temp) {
    
    this.dispatcher.dispatch(WEATHER_ACTIONS.WEATHER_TEMPERATURE_RETRIEVED, {
      temp: temp,
      icon: weatherCode
    });
    
  }
  
//  styleCircle(temp) {
//
//    if(temp <= 0) {
//      
//      temp = (temp * -1) + 50;
//    }
//    
//    var deg = (temp * 1.8);
//    var mask = document.getElementsByClassName('mask-inner')[0];
//
//    mask.style.webkitTransformOrigin = '0% 26px';
//    mask.style.webkitTransform = 'rotate(' + deg + 'deg)';
//    mask.style.mozTransform = 'rotate(' + deg + 'deg)';
//    mask.style.msTransform = 'rotate(' + deg + 'deg)';
//    mask.style.oTransform = 'rotate(' + deg + 'deg)';
//    mask.style.transform = 'rotate(' + deg + 'deg)';
//
//  }
//  
}