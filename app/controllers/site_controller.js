import { getAuthHeaders } from '/lib/volundir/core/auth.js';
import { System } from '/lib/volundir/core/system.js';
import { User } from '/app/models/user.js';
import { Application } from '/app/controllers/application_controller.js';

let data = {};

export class Site extends Application {
  static index() {
    console.log("Método index do SiteController");

    data = {
        user: {
            name: 'João Silva',
            email: 'joao.silva@example.com',
            registrationDate: '2023-01-15',
            status: 'Ativo'
        },
        user_loggedin: this.user_loggedin()
    };

    console.log('returned data: ', data);

    return data;
  }

  static page404 () {
    return {};
  }
}
