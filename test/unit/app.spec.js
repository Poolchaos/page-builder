import { AppModel } from './app.model';
import { App } from '../../target/app';

class RouterStub {
  constructor() {
    this.options = {};
  }
  configure(handler) {
    handler(this);
  }
  map(routes) {
    this.routes = routes;
  }
}

class ApplicationPropertiesStub {
}

class HttpClientStub {
}

class ParticleStub {
}

class UserFactoryStub {
}

describe('the App module', () => {

  var sut;
  var mod;
  var mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    mod = new AppModel();
    sut = new App(new ApplicationPropertiesStub(),new HttpClientStub(),new ParticleStub(),new UserFactoryStub());
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('configures the router title', () => {
    expect(sut.router.title).toEqual('AIVA');
  });

  it('should have a welcome route', () => {
    expect(sut.router.routes).toContain(mod.routeMap.get('welcome'));
  });

  it('should have a login route', () => {
    expect(sut.router.routes).toContain(mod.routeMap.get('login'));
  });

  it('should have a register route', () => {
    expect(sut.router.routes).toContain(mod.routeMap.get('register'));
  });

  it('should have a verify route', () => {
    expect(sut.router.routes).toContain(mod.routeMap.get('verify'));
  });

  it('should have an agent route', () => {
    expect(sut.router.routes).toContain(mod.routeMap.get('agent'));
  });

  it('should have a forgot password route', () => {
    expect(sut.router.routes).toContain(mod.routeMap.get('forgotpassword'));
  });

  it('should have a reset password route', () => {
    expect(sut.router.routes).toContain(mod.routeMap.get('resetpassword'));
  });

  it('should have no other routes', () => {
    expect(sut.router.routes).toEqual(mod.routes());
  });
});
