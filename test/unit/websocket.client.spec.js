import { WebSocketClient } from '../../target/_common/services/websocket.client';

describe('the WebSocketClient module', () => {

  var wsClient;

  beforeEach(() => {
    wsClient = new WebSocketClient();
    wsClient.io.uri = 'ws://foo.com';
  });

  it('contains a oi.uri property', () => {
    expect(wsClient.io.uri).toBeDefined();
  });

  describe('when connecting', () => {

    it('should create a new websocket', () => {
      expect(wsClient.ws).toBeUndefined();
      wsClient.connect();
      expect(wsClient.ws).toBeDefined();
    });
  });

  describe('when emitting', () => {

    beforeEach(() => {
      wsClient.connect();
      spyOn(wsClient.ws, 'send');
    });

    it('should send a message and ignore the topic', () => {
      wsClient.emit('foo', {bar: 'baz'});
      expect(wsClient.ws.send).toHaveBeenCalledWith({bar: 'baz'});
    });
  });

  describe('when handling', () => {

    beforeEach(() => {
      wsClient.connect();
      spyOn(wsClient.ws, 'onmessage');
    });

    it('should wait for a message and ignore the topic', () => {
      let cb = () => {};
      wsClient.on('foo', cb);
      expect(wsClient.ws.onmessage).toBe(cb);
    });
  });

  //  describe('should have an emit function', () => {
  //  });
});
