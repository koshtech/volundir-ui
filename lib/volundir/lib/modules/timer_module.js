import { BaseModule } from '/lib/volundir/base/base_module.js';

export class TimerModule extends BaseModule  {
  constructor() {
    super();
  }

  hide(object, seconds=1){
    // console.log(' [Timer][hide] in action!');

    setTimeout(() => {
      object.classList.remove('show');
      object.classList.add('hide');
      object.style.display = 'none';
      setTimeout(() => object.remove(), (seconds*1000));
    }, seconds*1000);
  }

  fade(element) {
    console.log(' [Timer][fade] start...');

    const fadeElement = document.getElementById(element);

    fadeElement.classList.toggle('fade-out');

    setTimeout(() => {
      fadeElement.style.display = 'none';
    }, 2000);

    console.log(' [Timer][fade] ...end');
  }
}
