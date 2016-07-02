/*
aurelia
*/
import {handle} from 'aurelia-flux';
/*
aiva
*/
import {WEATHER_ACTIONS} from './weather.actions';

export class WeatherStore {
  
  weather = {
    '395': 'snow-with-thunder',
    '392': 'snow-with-thunder',
    '389': 'rain-with-thunder',
    '386': 'rain-with-thunder',
    '377': 'heavy-rain',
    '374': 'heavy-rain',
    '371': 'snow',
    '368': 'snow',
    '365': 'moderate-rain',
    '362': 'moderate-rain',
    '359': 'moderate-rain',
    '356': 'heavy-rain',
    '353': 'moderate-rain',
    '350': 'snow',
    '338': 'snow',
    '335': 'snow',
    '332': 'snow',
    '329': 'snow',
    '326': 'snow',
    '323': 'snow',
    '320': 'moderate-rain',
    '317': 'moderate-rain',
    '311': 'moderate-rain',
    '308': 'heavy-rain',
    '305': 'heavy-rain',
    '302': 'moderate-rain',
    '299': 'moderate-rain',
    '296': 'moderate-rain',
    '293': 'moderate-rain',
    '284': 'moderate-rain',
    '281': 'moderate-rain',
    '266': 'moderate-rain',
    '263': 'moderate-rain',
    '260': 'fog',
    '248': 'fog',
    '230': 'snow-with-thunder',
    '227': 'snow',
    '200': 'thunder-cloud',
    '185': 'cloudy',
    '182': 'cloudy',
    '179': 'cloudy',
    '176': 'cloudy',
    '143': 'fog', // Mist
    '122': 'cloudy',
    '119': 'cloudy',
    '116': 'cloudy',
    '113': 'sunny'
  };

  currentWeather = {};
 
  @handle(WEATHER_ACTIONS.WEATHER_TEMPERATURE_RETRIEVED)
  handleWeatherTemperatureRetrieved(action, data) {
   
    this.currentWeather.icon = 'target/_assets/img/weather_' + this.weather[data.icon] + '.png';
    this.currentWeather.temp = data.temp + '°C';
  }
  
  
}