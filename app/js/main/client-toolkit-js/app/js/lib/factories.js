var factories = angular.module('app.toolkit.Factories', []);

factories.factory('RelevantFilterSearch', function () {

  function sortProfiles(profilesToFilter, fieldName) {
    profilesToFilter.sort(function (a, b) {
      return (a[fieldName] > b[fieldName]) ? 1 : ((b[fieldName] > a[fieldName]) ? -1 : 0);
    });
  }

  function alreadyInList(listItem, startingprofiles, middleprofiles, endingprofiles, fieldNameToFilterBy) {

    if (doesItemExistInList(startingprofiles, listItem, fieldNameToFilterBy)) {
      return true;
    } else if (doesItemExistInList(middleprofiles, listItem, fieldNameToFilterBy)) {
      return true;
    } else if (doesItemExistInList(endingprofiles, listItem, fieldNameToFilterBy)) {
      return true;
    } else {
      return false;
    }

  }

  function doesItemExistInList(list, listItem, fieldNameToFilterBy) {

    var found = false;

    for (var i in list) {

      //console.log(list[i].email, ' === ', listItem.email);

      if (list[i][fieldNameToFilterBy] === listItem[fieldNameToFilterBy]) {
        found = true;
      }

    }

    return found;

  }

  return {
    getMostRelevant: function (params) {

      //console.log(' : params -> ', params);

      var profiles = params.profiles;
      var searchText = (params.searchText).toLowerCase();
      var fieldNameToFilterBy = params.fieldNameToFilterBy;
      var fieldNames = params.fieldNames;
      var filtered = params.alreadyFiltered;

      var startingprofiles = [];
      var middleprofiles = [];
      var endingprofiles = [];

      for (var i in profiles) {

        for (var f in fieldNames) {

          //console.log('profiles -> ', profiles[i]);
          //console.log('fieldNames -> ', fieldNames[f]);

          var item = profiles[i];
          var searchLength = searchText.length;
          var value = item[fieldNames[f]] ? item[fieldNames[f]].toLowerCase() : '';

          if (!alreadyInList(profiles[i], startingprofiles, middleprofiles, endingprofiles, fieldNameToFilterBy)) {

            if (value.substring(0, searchLength) === searchText) {
              startingprofiles.push(item);
            } else if (value.indexOf(searchText) !== -1) {
              middleprofiles.push(item);
            }

          }

        }

      }

      sortProfiles(startingprofiles, fieldNameToFilterBy);
      sortProfiles(middleprofiles, fieldNameToFilterBy);

      var tmpArr = startingprofiles.concat(middleprofiles);

      for (var ip in profiles) {
        var found = false;
        var profile = profiles[ip];

        for (var fm in tmpArr) {

          var itemInList = tmpArr[fm];

          if (profile[fieldNameToFilterBy] === itemInList[fieldNameToFilterBy]) {

            found = true;

          }

        }

        if (found) {
          if (!found) {
            endingprofiles.push(profile);
          }
        }

        sortProfiles(endingprofiles, fieldNameToFilterBy);

        startingprofiles.concat(middleprofiles);

        return filtered ? startingprofiles.concat(middleprofiles).concat(endingprofiles) : startingprofiles.concat(middleprofiles);

      }
    }

  };
});

factories.factory('ProfilePictureFactory', function () {

  var defaultPicUser = "/img/profile/profile_pic-holder.png";
  var defaultPicOrganisation = "/img/profile/groupProfile_pic-holder.jpg";
  var base64 = 'data:image/png;base64,';

  return {

    build: function (params) {

      var profiles = params.profiles;
      var profilePicture = params.profilePicture;

      for (var i in profiles) {

        var item = profiles[i];

        if (!item[profilePicture] || item[profilePicture].length === 0) {

          if (params.accountType === 'ORGANISATION' || item.accountType === 'ORGANISATION') {

            item[profilePicture] = defaultPicOrganisation;

          } else {

            item[profilePicture] = defaultPicUser;

          }

        } else if (item[profilePicture].indexOf(base64) === -1 && item[profilePicture].indexOf(defaultPicUser) === -1 && item[profilePicture].indexOf(defaultPicOrganisation) === -1) {
          item[profilePicture] = 'data:image/png;base64,' + item[profilePicture];
        }

      }

      return profiles;

    }

  };
});

factories.factory('MakeChangesToList', function () {

  return {

    addItem: function (params) {

      var list = params.list;
      var item = params.item;
      var key = params.key;
      var found = false;

      for (var i in list) {
        if (list[i][key] === item[key]) {
          found = true;
        }
      }

      if (!found) {
        list.push(item);
      }

      return list;

    },
    changeItem: function (params) {

      var list = params.list;
      var item = params.item;
      var key = params.key;

      for (var i in list) {
        var currentItem = list[i];

        if (currentItem[key] === item[key]) {

          list[i] = item;

        }

      }

      return list;

    },
    removeItem: function (params) {

      var list = params.list;
      var item = params.item;
      var key = params.key;

      var tempArray = [];

      for (var i in list) {
        var currentItem = list[i];

        if (currentItem[key] !== item[key]) {

          tempArray.push(currentItem);

        }

      }

      return tempArray;

    }

  };

});

factories.factory('DataService', ['ProfilePictureFactory', 'StateTransitionGateway', '$sessionStorage', 'InternalMessageSocket',
    function (ProfilePictureFactory, StateTransitionGateway, $sessionStorage, InternalMessageSocket) {

    var SubscribedEvents = [];

    var methods = {
      getSession: {
        all: function () {
          return $sessionStorage;
        },
        specific: function (obj) {
          var payload = {};
          for (var i in obj) {
            payload[i] = $sessionStorage[i];
          }
          return payload;
        }
      },
      getLocal: {
        all: function () {
          return $sessionStorage;
        },
        specific: function (obj) {
          var payload = {};
          for (var i in obj) {
            payload[i] = $sessionStorage[i];
          }
          return payload;
        }
      },
      setValues: {
        scope: function (payload) {
          methods.messaging.publish({
            name: 'SetScopeValues',
            payload: payload
          });
        },
        session: function (payload) {
          for (var i in payload) {
            $sessionStorage[i] = payload[i];
          }
        }
      },
      clearValues: {
        scope: function (payload) {
          methods.messaging.publish({
            name: 'ClearScopeValues',
            payload: {}
          });
        },
        session: {
          all: function () {
            for (var i in $sessionStorage) {
              delete $sessionStorage[i];
            }
          },
          specific: function (data) {
            for (var i in data) {
              $sessionStorage[i] = null;
            }
          }
        }
      },
      profilePictureFactory: ProfilePictureFactory,
      messaging: {
        publish: function (state) {
          InternalMessageSocket.publish(state);
        },
        subscribe: function (state) {
          var found = false;
          for (var i in SubscribedEvents) {
            if (SubscribedEvents[i].name === state.name) {
              found = true;
              SubscribedEvents[i] = state;
            }
          }
          if (!found) {
            SubscribedEvents.push(state);
          }
          this.subscribe(state);
        },
        deregisterListeners: function (state) {
          var scope = state.scope;
          var name = state.name;
          var offCallMeFn;

          if (scope && name) {
            offCallMeFn = scope.$on(name, function () {
              console.log('%c :: listener ' + name + ' should be deregistered :: ', 'background:yellow;font-size:16px;');
            });
            //this will deregister that listener
            offCallMeFn();
            return;
          }
          for (var i in SubscribedEvents) {
            offCallMeFn = SubscribedEvents[i].scope.$on(SubscribedEvents[i].name, SubscribedEvents[i].callback);
            //this will deregister that listener
            offCallMeFn();
          }
          SubscribedEvents = [];
        }
      },
      goto: function (state) {
        StateTransitionGateway.send(state);
      }
    };

    return methods;

}]);