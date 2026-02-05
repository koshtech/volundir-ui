const DevicePermissionEngine = await File.import('lib/volundir/lib/engines/device/device_permission_engine.js');

export class DeviceManagerModule extends BaseModule {
// export class DeviceManagerModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = [];
  }

  async request(driver, capability) {
    console.log('[DeviceManagerModule][request] driver: ', driver);
    console.log('[DeviceManagerModule][request] capability: ', capability);

    const device = await DevicePermissionEngine.request(driver, capability);
    console.log('[DeviceManagerModule][request] device: ',device );

    return device;
  }

  async loadDriver(path) {
    let driver = null;

    console.log('[DeviceManagerModule][loadDriver] path: ', path);
    try {

      const loadingDriver = await import(path);
      console.log('[DeviceManagerModule][loadDriver] loadingDriver: ',loadingDriver );

      const DriverClass = loadingDriver.default;
      console.log('[DeviceManagerModule][loadDriver] DriverClass: ', DriverClass);

      driver = new DriverClass();
      console.log('[DeviceManagerModule][loadDriver] driver: ', driver);

      const validated = this.validate(driver);
      console.log('[DeviceManagerModule][loadDriver] validated: ', validated);

    } catch (error) {
      // console.log(`[DeviceManagerModule][loadDriver] Error loading mApp: ${mAppName}`);
      console.log(`[DeviceManagerModule][loadDriver] Message: ${error}`);
    }

    return driver;
  }

  validate(driver) {
    const required = [
      'getState',
      'getAvailability'
    ];

    required.forEach(method => {
      if (typeof driver[method] !== 'function') {
        throw new Error(`Driver missing method: ${method}`);
      }
    });
  }
}
