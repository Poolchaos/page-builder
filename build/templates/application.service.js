import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {WebSocket} from './websocket';
import {ApiFactory} from '../factories/api.factory';

@inject(HttpClient, WebSocket, ApiFactory)
export class ApplicationService {

  constructor(http, ws, apiFactory) {

    this.http = http;
    this.ws = ws;
    this.apiFactory = apiFactory;
  }

  // Commands
{% for command in commands %}
  {{ command.name|first|lower }}{{ command.name|replace('^\w', '') }}({{ command.properties|join(', ') }}) {

    this.ws.publish(this.apiFactory.buildCommand('{{ command.name }}', { {% for property in command.properties %}{{ property }}: {{ property }}{% if !loop.last %}, {% endif %}{% endfor %} }));
  }
{% endfor %}
  // Events
{% for event in events %}
  on{{ event }}(callback) {

    this.ws.subscribe(this.apiFactory.buildEvent('{{ event }}', callback));
  }
{% endfor %}
  // Queries
{% for query in queries %}
  {{ query.name|first|lower }}{{ query.name|replace('^\w', '') }}({{ query.properties|join(', ') }}) {

    return this.http.get(this.apiFactory.buildQuery('{{ query.name }}', { {% for property in query.properties %}{{ property }}: {{ property }}{% if !loop.last %}, {% endif %}{% endfor %} }));
  }
{% endfor %}
  // Updates
{% for update in updates %}
  {{ update.name|first|lower }}{{ update.name|replace('^\w', '') }}({{ update.properties|join(', ') }}) {

    return this.http.put(this.apiFactory.buildUpdate('{{ update.name }}'), { {% for property in update.properties %}{{ property }}: {{ property }}{% if !loop.last %}, {% endif %}{% endfor %} });
  }
{% endfor %}}
