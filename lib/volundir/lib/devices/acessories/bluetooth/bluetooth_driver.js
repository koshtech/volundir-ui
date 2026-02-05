import { BaseDeviceDriver } from '/lib/volundir/base/base_device_driver.js';
// const BaseDeviceDriver = await File.import('lib/volundir/base/base_device_driver.js');

export class BluetoothDriver extends BaseDeviceDriver {
  static capability = 'bluetooth';

  async getAvailability() {
    return !!navigator.bluetooth;
  }

  async getState() {
    return {
      available: await this.getAvailability(),
      permissions: 'user-gesture-required'
    };
  }

  async getDevices() {
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth not supported');
    }

    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    });

    return [device];
  }
}
