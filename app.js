// import { Router } './lib/volundir/core/app_router.js';

// document.addEventListener('DOMContentLoaded', () => {
//   Router.start();
// });

// Router.map({
//   '/posts': () => loadController('posts', 'index'),
//   '/posts/:id': (params) => loadController('posts', 'show', params),
// });


// window.AppRouter = AppRouter;
// const router = new AppRouter();

// window.location = '/baba';

import { AppRouter } from './lib/volundir/core/app_router.js';
const app = new AppRouter();
