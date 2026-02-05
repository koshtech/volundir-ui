export class DevicesController extends ApplicationController {
  constructor () {
    super();

    this.data = {};
    this.requiredModules = ['device_manager'];
  }

  index() {

    // const button = document.getElementById("request-bluetooth-permission");

    // button.addEventListener('click', async () => {
    //   try {
    //     const deviceManager = await this.modules.deviceManager
    //     console.log('[DevicesController][index] deviceManager: ', deviceManager);

    //     const bluetooth = await deviceManager.loadDriver(
    //       '/lib/volundir/lib/devices/bluetooth/index.js'
    //     );
    //     console.log('[DevicesController][index] bluetooth: ', bluetooth);

    //     const device = await deviceManager.request(bluetooth, 'bluetooth');
    //     console.log('[DevicesController][index] device: ', device);

    //     console.log(device);
    //   } catch (error) {
    //     console.error(error);
    //     console.log('[DevicesController][index] error: ', error);
    //   }
    // });

    this.data = {
      bluetooth: {
        permitted: false,
        state: 'Not Available',
        availability: '0%',
        devices: 'no devices available. Check for browser or system permissions.'
      }
    }

    console.log('[DevicesController][index] returned data: ', this.data);
    return this.data;
  }

  request_bluetooth_permission() {
    console.log('[DevicesController][request_bluetooth_permission] manager: ');
  }

  // indexX() {
  //   try {

  //   console.log('[DevicesController][index] this: ', this);

  //     const manager = new DeviceManagerModule();
  //     // const manager = this.modules.device_manager;
  //     console.log('[DevicesController][index] manager: ', manager);

  //     const bluetooth = await manager.loadDriver('http://127.0.0.1:3020/lib/volundir/lib/devices/acessories/bluetooth/index.js');
  //     console.log('[DevicesController][index] bluetooth: ', bluetooth);
  //   } catch (error) {
  //     console.log(`[DevicesController][index] Error loading mApp: ${mAppName}`);
  //     console.log(`[DevicesController][index] Message: ${error}`);
  //   }

  //   if (await bluetooth.getAvailability()) {
  //     const devices = await bluetooth.getDevices();
  //     console.log(devices);
  //   }

  //   // if (btPermission.state == "denied") {
  //     this.data = {
  //         bluetooth: {
  //             state: 'Faked OK', // btPermission.state,
  //             availability: 'Faked Available', // Bluetooth.getAvailability(),
  //             devices: '[Faked Device 1], [Faked Device 2]' // Bluetooth.getDevices()
  //         }
  //     }
  //   // }

  //   console.log('[DevicesController][index] returned data: ', this.data);

  //   return this.data;
  // }
}
