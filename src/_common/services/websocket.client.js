export class WebSocketClient {

  io = {};

  constructor() {
    this.io.uri = ''; // mimic socket.io
  }

  connect() {

    this.ws = new WebSocket(this.io.uri);

    this.ws.onmessage = env => {

      let data;

      // tmp solution to deal with malformed messages
      try {
        data = JSON.parse(env.data);
      }catch (e) {
        console.error('this.ws.onmessage parse error = ', {error: e, data: env.data});
      }finally {
        data = {
          type: (data && data.type) ? data.type : {},
          payload: (data && data.payload) ? data.payload : {}
        };
      }

      // convert messsage
      this.callback && this.callback({
        name: data.type,
        state: data.payload
      });
    };
  }

  emit(topic, env) {
    // convert and serialise messsage
    this.ws.send(JSON.stringify({
      authorization: env.Authorization,
      root: env.feature,
      type: env.name,
      payload: env.state,
      requestId: env.trackingId,
    }));
  }

  on(topic, callback) {
    this.callback = callback;
  }
}
