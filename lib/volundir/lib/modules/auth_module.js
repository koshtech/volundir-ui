const AuthService          = await File.import('lib/volundir/lib/services/auth_service.js');
const AuthPermissionEngine = await File.import('lib/volundir/lib/modules/auth_permission_engine.js');

import profiles from 'http://127.0.0.1:3020/config/profiles.json' with { type: 'json' };

export class AuthModule extends BaseModule {
  constructor() {
    super();

    this.requiredModules = ['file', 'timer', 'render', 'display'];

    this.active = false;
    this.resolved = false;

    this.authService = new AuthService();
    this.permissions = new AuthPermissionEngine(profiles);

    // Resolve loaded modules dependencies
    // this.init();
  }

  init() {
    console.log('[AuthModule] init()');
    // this.modules = {
    //   "file": new FileModule(),
    //   "timer": new TimerModule(),
    //   "render": new RenderModule(),
    //   "display":  new DisplayModule()
    // };

    // Inject Logger Model dependencies
    // this.models['render']['modules']['file']  = this.modules['file'];
    // this.models['render']['modules']['timer'] = this.modules['timer'];

    // this.models['display']['modules']['timer']  = this.modules['timer'];
    // this.models['display']['modules']['render'] = this.modules['render'];

    // this.resolved = true;
  }

  boot() {
    console.log('[AuthModule] boot()');

    this.authService.restoreSession();

    globalThis.Auth = {
      authenticated: () => this.authService.isAuthenticated(),
      currentUser: () => this.authService.currentUser(),
      can: (action) =>
        this.permissions.can(this.authService.currentUser(), action),
      login: (...args) => this.authService.login(...args),
      logout: () => this.authService.logout()
    };
  }
}
