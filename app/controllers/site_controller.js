import { getAuthHeaders } from '/lib/volundir/core/auth.js';
// import { System } from '/lib/volundir/core/system.js';
// import { User } from '/app/models/user.js';
import { Coordinator } from '/lib/volundir/core/coordinator.js';
import { Application } from '/app/controllers/application_controller.js';

export class Site extends Application {
  constructor () {
    super();

    this.data = {};
  }

  index() {
    console.log("Método index do SiteController");

    this.data = {
        user: {
            name: 'João Silva',
            email: 'joao.silva@example.com',
            registrationDate: '2023-01-15',
            status: 'Ativo'
        },
        user_loggedin: this.user_loggedin()
    };

    console.log('returned data: ', this.data);

    return this.data;
  }

  page404 () {
    return {};
  }
}
