import { Volundir } from '/lib/volundir/base/volundir.js';

if (!globalThis.VolundirApp) {
  const app = new Volundir();
  await app.init();

  globalThis.VolundirApp = app;
}
