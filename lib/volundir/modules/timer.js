import { Coordinator } from '/lib/volundir/core/coordinator.js';

class TimerModule extends Coordinator  {
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

export const timer = new TimerModule();
