/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
/*
zailab
*/
import {WeatherService} from './weather.service';
import {WeatherStore} from './weather.store';

@inject(HttpClient, WeatherService, WeatherStore)
export class Weather {
  
  constructor(httpClient, weatherService, weatherStore) {
    
    this.httpClient = httpClient;
    this.weatherService = weatherService;
    this.weatherStore = weatherStore;
    let location = this.getLocation();
    
    httpClient.configure(config => {
      config
        .withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        });
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => this.getWeather(position));
    } else {

    }
  }

  getWeather(position) {

    this.weatherService.getTemperature(position.coords.latitude, position.coords.longitude);
  }
}
