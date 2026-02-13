import { BaseDeviceDriver } from '../base/base_device_driver.js';

export class MicrophoneDriver extends BaseDeviceDriver {
  static capability = 'microphone';

  async getAvailability() {
    return !!navigator.mediaDevices?.getUserMedia;
  }

  async requestPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      return true;
    } catch {
      return false;
    }
  }

  async getState() {
    return {
      available: await this.getAvailability(),
      permissionGranted: await this.requestPermission()
    };
  }
}
