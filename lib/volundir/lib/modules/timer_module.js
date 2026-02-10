const BaseModule = await File.import('lib/volundir/base/base_module.js');

export class TimerModule extends BaseModule  {
  constructor() {
    super();

    // Hubs are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
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

  fade(element, seconds=3) {
    // console.log(' [Timer][fade] start...');

    const fadeElement = document.getElementById(element);

    fadeElement.classList.toggle('fade-out');

    setTimeout(() => {
      fadeElement.style.display = 'none';
    }, seconds*1000);

    // console.log(' [Timer][fade] ...end');
  }

  async executeWhenReady(objectFunction, seconds=1, attemps=3) {
    console.log(' [Timer][executeWhenReady] objectFunction: ', objectFunction);
    console.log(' [Timer][executeWhenReady] seconds: ', seconds);
    console.log(' [Timer][executeWhenReady] attemps: ', attemps);

    let returnedValue;

    for (let i = 0; i < attemps; i++) {
      console.log(' [Timer][executeWhenReady] Iteration: ', i);

      returnedValue = await objectFunction;

      console.log(' [Timer][executeWhenReady] Iteration returnedValue: ', returnedValue);

      await this.sleep(seconds);
    }

    console.log(' [Timer][executeWhenReady] Final returnedValue: ', returnedValue);

    return returnedValue;
  }

  // Sleep the function execution
  // Defaults:
  //    delay   = 1000ms = 1 second

  sleep(seconds=1) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
  }
}
