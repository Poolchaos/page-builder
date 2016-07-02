import {
  inject, LogManager
}
from 'aurelia-framework';
/*
 */
import mapsapi from 'google-maps-api';
import jqvmap from 'manifestinteractive/jqvmap';
/*
 */
const logger = LogManager.getLogger('Location');
/*
 */

@
inject(mapsapi('AIzaSyCOdH6qx7jUEpgn_h8KKKfegD1pL6YmANg'))
export class Location {

  constructor(mapsapi) {

    this.mapsApi = mapsapi.then(maps => {

      this.geocoder = new google.maps.Geocoder();
      this.getMapData();
    });
  }

  getMapData() {

    this.getCurrentLocation(currentLocation => {

      this.geocoder.geocode({
        'location': currentLocation
      }, (results, status) => {

        if (status === google.maps.GeocoderStatus.OK && results[1]) {

          let location = this.getFormattedLocation(results, 'administrative_area_level_2');
          this.address = location.address;
          this.initMap(location.countryCode);

        }
      });

    });
  }
  
  initMap(region) {

    $('#map-div').vectorMap({
      map: 'world_en',
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#818181',
      borderOpacity: 0.25,
      borderWidth: 1,
      color: '#f4f3f0',
      enableZoom: false,
      hoverColor: '#009dd7',
      hoverOpacity: null,
      normalizeFunction: 'linear',
      scaleColors: ['#b6d6ff', '#005ace'],
      selectedColor: '#00fff6',
      //onRegionClick: this.selectRegion(region),
      showTooltip: true,
      selectedRegions: [region]
    });
  }

  getCurrentLocation(callback) {

    navigator.geolocation.getCurrentPosition(position => {

      let currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      callback(currentLocation);

    }, error=> {

      logger.debug('could not determine location. ERROR:  > ', error);
    });
  }

  getFormattedLocation(list, level) {

    let location = {};

    for (let item of list) {

      let levels = item.types;
      for (let lvl of levels) {

        if (lvl === level && levels[1] === 'political') {

          location.address = item.formatted_address;
          location.countryCode = this.getCountryCode(item.address_components);

          return location;
        }
      }
    }

  }

  getCountryCode(list) {

    for (let item of list) {

      for (let type of item.types) {

        if (type === 'country') {
          return item.short_name;
        }
      }

    }
  }

}
