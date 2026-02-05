export class DevicePermissionEngine {
  static async request(driver, capability, options = {}) {
    if (!(await driver.getAvailability())) {
      throw new Error(`${capability} not available`);
    }

    if (typeof driver.requestDevice !== 'function') {
      throw new Error(`${capability} does not support requestDevice`);
    }

    // ESTE método deve ser chamado dentro de um evento de usuário
    return driver.requestDevice(options);
  }
}
