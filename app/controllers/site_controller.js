import { getAuthHeaders } from '/lib/volundir/base/auth.js';
// import { System } from '/lib/volundir/core/system.js';
// import { User } from '/app/models/user.js';
// import { Coordinator } from '/lib/volundir/base/object_coordinator.js';
import { ApplicationController } from '/app/controllers/application_controller.js';

export class SiteController extends ApplicationController {
  constructor () {
    super();

    this.data = {};
  }

  index() {
    console.log('[SiteController][index] this: ', this);
    console.log('[SiteController][index] Coordinator: ', Coordinator);

    this.data = {
        user: {
            name: 'João Silva',
            email: 'joao.silva@example.com',
            registrationDate: '2023-01-15',
            status: 'Ativo'
        },
        user_loggedin: this.user_loggedin()
    };

    console.log('[SiteController][index] returned data: ', this.data);

    return this.data;
  }

  page404 () {
    return {};
  }
}
