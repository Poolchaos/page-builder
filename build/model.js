var fs = require('fs');
var NAMESPACE = 'com.zailab';

var API = require('../ddd/api.model');
//var API = null;

var apiModel = {
  commands: {},
  events: {},
  queries: {},
  updates: {}
};
var serviceModel = {
  commands: [],
  events: [],
  queries: [],
  updates: []
};

function cap(txt) {
  if (!txt) return;
  return txt[0].toUpperCase() + txt.substring(1);
}

function low(txt) {
  return txt[0].toLowerCase() + txt.substring(1);
}

function capType(type) {
  if (type === 'command') {
    return 'Command';
  }
  if (type === 'event') {
    return 'Event';
  }
}

function typeId(domain, root, type, name) {

  return NAMESPACE + '.' + domain + '.' + root + '.api.' + type + 's.' + name + capType(type);
}

/*
 *  ModelInstance
 *
 *  This transposes the MESSAGE constant. <> indicates optional
 *
 *  BEFORE:
 *   {
 *     domain: {
 *       root: {
 *         commands: ['CommandName1', 'CommandName2'],
 *         events: ['EventName1', 'EventName2'],
 *         queries: [verb: 'field'],
 *         repos: [{verb: 'RepoName', findBy: 'field'}<, params: ['field']>],
 *         views: [{verb: 'ViewName', findBy: 'field'}<, params: ['field']>],
 *         updates: [{verb: 'ViewName', params: ['field']}]
 *       }
 *     }
 *   }
 *
 *  AFTER:
 *   {
 *     CommandName1 : {
 *       root: 'root',
 *       typeId: 'namespace.domain.root.api.commands.CommandName1Command'
 *     },
 *     CommandName2 : {
 *       root: 'root',
 *       typeId: 'namespace.domain.root.api.commands.CommandName2Command'
 *     },
 *     EventName1 : {
 *       root: 'root',
 *       typeId: 'namespace.domain.root.api.events.EventName1Event'
 *     },
 *     EventName2 : {
 *       root: 'root',
 *       typeId: 'namespace.domain.root.api.events.EventName2Event'
 *     },
 *     // queries
 *     VerbDomainRootQueryField: {
 *       path: 'domain/root/verb/query',
 *       params: ['field']
 *     },
 *     // repos
 *     VerbDomainRoot/VerbRepoName: {
 *       path: 'domain/root/verbRepoNameViewRepository/search/findByField',
 *       params: ['field']
 *     },
 *     // views
 *     VerbDomainRootViewName: {
 *       path: 'domain/root/verbViewNameView/search/findByField',
 *       params: ['field']
 *     }
 *     // updates
 *     VerbDomainRootViewName: {
 *       path: 'domain/root/viewNameView/verb',
 *       params: ['field']
 *     }
 *   }
 */
function ModelInstance() {

  for (var domain in API) {

    var value = API[domain];

    for (var root in value) {

      var api = value[root];

      //      var realRoot = api.root;
      var version = api.version;

      var routing = version && version === '0.0.1' ? domain + '.' + root : root;

      // COMMANDS

      if (api.commands && api.commands.length > 0) {

        for (var commandIndex in api.commands) {

          var command = api.commands[commandIndex];

          apiModel.commands[command.name] = {
            root: routing,
            typeId: typeId(domain, root, 'command', command.name)
          };

          serviceModel.commands.push({
            name: command.name,
            properties: command.params
          });
        }
      }

      // EVENTS

      if (api.events && api.events.length > 0) {

        for (var eventIndex in api.events) {

          var event = api.events[eventIndex];

          apiModel.events[event] = {
            root: routing,
            typeId: typeId(domain, root, 'event', event)
          };

          serviceModel.events.push(event);
        }
      }

      // VERBS

      var verbs = ['display', 'reset', 'validate', 'authenticate'];

      // KEY

      var key = cap(domain) + (domain === root ? '' : cap(root));
      var path = domain + '/' + (domain === root ? '' : root + '/');

      // QUERIES

      if (api.queries && api.queries.length > 0) {

        for (var queryIndex in api.queries) {

          var query = api.queries[queryIndex];

          for (var verbIndex in verbs) {

            var verb = verbs[verbIndex];

            if (query[verb]) {

              var queryField = query[verb];
              var queryKey = cap(verb) + key + cap(queryField);
              var queryPath = path + verb + '/' + queryField;
              var queryParams = [queryField];

              apiModel.queries[queryKey] = {
                path: queryPath,
                params: queryParams
              };

              serviceModel.queries.push({
                name: queryKey,
                properties: queryParams
              });
            }
          }
        }
      }

      // CUSTOM QUERIES

      if (api.customQueries && api.customQueries.length > 0) {

        for (var queryIndex in api.customQueries) {

          var query = api.customQueries[queryIndex];
          var queryKey = key;
          var queryPath = query.uri;
          var queryParams = query.params;

          apiModel.queries[queryKey] = {
            path: queryPath,
            params: queryParams
          };

          serviceModel.queries.push({
            name: queryKey,
            properties: queryParams
          });
        }
      }

      // REPOS

      if (api.repos && api.repos.length > 0) {

        for (var repoIndex in api.repos) {

          var repo = api.repos[repoIndex];

          for (var verbIndex in verbs) {

            var verb = verbs[verbIndex];

            if (repo[verb]) {

              var repoName = repo[verb];
              var repoKey = cap(verb) + repoName;
              var repoPath = path + verb + repoName + 'ViewRepository/search/findBy' + cap(repo.findBy);
              var repoParams = repo.params ? repo.params : [repo.findBy];

              apiModel.queries[repoKey] = {
                path: repoPath,
                params: repoParams
              };

              serviceModel.queries.push({
                name: repoKey,
                properties: repoParams
              });
            }
          }
        }
      }

      // VIEWS

      if (api.views && api.views.length > 0) {

        for (var viewIndex in api.views) {

          var view = api.views[viewIndex];

          for (var verbIndex in verbs) {

            var verb = verbs[verbIndex];

            if (view[verb]) {

              var viewName = view[verb];
              var viewKey = cap(verb) + key + viewName;
              var findBy = view.findBy ? view.findBy : view.findAllBy;
              var findByStr = view.findBy ? 'findBy' : 'findAllBy';
              var viewPath = path + verb + viewName + 'View/search/' + findByStr + cap(findBy);
              var viewParams = view.params ? view.params : [findBy];

              apiModel.queries[viewKey] = {
                path: viewPath,
                params: viewParams
              };

              serviceModel.queries.push({
                name: viewKey,
                properties: viewParams
              });
            }
          }
        }
      }

      // UPDATES

      if (api.updates && api.updates.length > 0) {

        for (var updatesIndex in api.updates) {

          var update = api.updates[updatesIndex];

          for (var verbIndex in verbs) {

            var verb = verbs[verbIndex];

            if (update[verb]) {

              var updateName = update[verb];
              var updateKey = cap(verb) + key + updateName;
              var updatePath = path + low(updateName) + 'View/' + verb;
              var updateParams = update.params;

              apiModel.updates[updateKey] = {
                path: updatePath,
                params: updateParams
              };

              serviceModel.updates.push({
                name: updateKey,
                properties: updateParams
              });
            }
          }
        }
      }
    }
  }
}

function modelApi(dir) {
  
  API = {};

  fs.readdir(dir, function (err, files) {

    //    console.log('readdir > err = ', err);
    //    console.log('readdir > files = ', files);

    for (var fileIndex in files) {

      var file = files[fileIndex];

      if (file.endsWith('api.model.json')) {

        var data = fs.readFileSync(dir + '/' + file, 'utf8');

        data = JSON.parse(data);

        var parts = file.split('.');

        if (parts[0] === '_lost') {

          for (var domain in data) {

            var domainData = data[domain];

            for (var root in domainData) {

              if (!API[domain]) {
                API[domain] = {};
              }

              API[domain][root] = data[domain][root];
            }
          }
        } else {

          if (!API[parts[0]]) {
            API[parts[0]] = {};
          }

          API[parts[0]][parts[1]] = data[parts[0]][parts[1]];
        }
      }
    }

    new ModelInstance();

    console.log('');

    //    var _sortedServiceModel = {
    //      commands: serviceModel.commands.sort(sortByName),
    //      events: serviceModel.events.sort(),
    //      queries: serviceModel.queries.sort(sortByName),
    //      updates: serviceModel.updates.sort(sortByName)
    //    };
    //    
    //    console.log('_sortedServiceModel: \r\n\r\n', JSON.stringify(_sortedServiceModel));
  });
}

if (API === null) {
  modelApi('./ddd');
} else {
  new ModelInstance();
}

function sortByName(o1, o2) {
  if (o1.name === o2.name) {
    return 0;
  }
  return o1.name > o2.name ? 1 : -1;
}

function getSortedKeys(obj) {

  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  keys.sort();
  return keys;
}

function sortProperties(obj) {

  var keys = getSortedKeys(obj);

  var newObj = {};
  for (var keyIndex in keys) {
    var key = keys[keyIndex];
    newObj[key] = obj[key];
  }
  return newObj;
}

var model = {
  //  apiModel: apiModel,
  apiModel: function () {
    return {
      commands: sortProperties(apiModel.commands),
      events: sortProperties(apiModel.events),
      queries: sortProperties(apiModel.queries),
      updates: sortProperties(apiModel.updates)
    }
  },
  serviceModel: function () {
    return {
      commands: serviceModel.commands.sort(sortByName),
      events: serviceModel.events.sort(),
      queries: serviceModel.queries.sort(sortByName),
      updates: serviceModel.updates.sort(sortByName)
    };
  }
};

module.exports = model;