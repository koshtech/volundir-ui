export class BaseDeviceDriver {
  static capability = 'unknown';

  async getState() {
    throw new Error('getState not implemented');
  }

  async getAvailability() {
    throw new Error('getAvailability not implemented');
  }

  async requestPermission() {
    throw new Error('requestPermission not implemented');
  }
}
