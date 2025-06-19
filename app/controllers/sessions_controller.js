// import { getAuthHeaders } from '/lib/volundir/core/auth.js';
// import page from '//unpkg.com/page/page.mjs';

export class Sessions {
  static login() {
    console.log("Método login do SessionsController");
    // console.log('received: ', html);

    // return returned_data;
  }

  static register(html) {
    console.log("Método register do SessionsController");
    // console.log('received: ', html);

    // return returned_data;
  }

  static forgot(html) {
    console.log("Método forgot do SessionsController");
    // console.log('received: ', html);

    // return returned_data;
  }

  static logout(html) {
    console.log("Método logout do SessionsController");
    // console.log('received: ', html);

    sessionStorage.removeItem('auth');
    alert('Sessão encerrada.');
    this.navigate('/');

    // return returned_data;
  }
}
