import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

import BleConstants from '../constants/BleConstants';
import logService from './LogService';

const BLE_PERMISSIONS = Platform.select({
  android: [
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    'android.permission.BLUETOOTH_ADMIN',
    'android.permission.BLUETOOTH',
    'android.permission.FOREGROUND_SERVICE',
  ],
  ios: [PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL],
});

const BLE_DISCOVER_PERIPHERAL_EVENT = 'BleManagerDiscoverPeripheral';
const BLE_NOTIFY_EVENT = 'BleManagerDidUpdateValueForCharacteristic';
const BLE_CONNECT_EVENT = 'BleManagerConnectPeripheral';
const BLE_DISCONNECT_EVENT = 'BleManagerDisconnectPeripheral';

// Little-endian
const bytesToNumber = bytes => {
  const dataHex = bytes
    .map(b => b.toString(16).padStart(2, '0'))
    .reverse()
    .join('');

  return parseInt(dataHex, 16);
};

const stringToCharCode = string => {
  const array = Array.from(string).map(char => {
    return char.charCodeAt(0);
  });
  return array;
};

class BleService {
  constructor() {
    let bleArray = [];
    for (const [key, value] of Object.entries(BleConstants)) {
      bleArray.push({
        name: key,
        serviceUUID: value?.serviceUUID,
        characteristicUUID: value?.characteristicUUID,
      });
    }
    this.bleConstants = bleArray;

    this.eventEmitter = new NativeEventEmitter(NativeModules.BleManager);
    this.eventHandlers = new Map();
    this.disconnectSensors = false;
  }

  log(id, message, serviceUUID, characteristicUUID) {
    const bleKeyName = this.bleConstants.find(
      e =>
        e.serviceUUID === serviceUUID &&
        e.characteristicUUID === characteristicUUID,
    )?.name;

    logService.log(`${bleKeyName ? `${bleKeyName} | ` : ''}  ${message} `);
  }

  async initialize() {
    let checkPermissions = await Permissions.checkMultiple(BLE_PERMISSIONS);

    for (const permission in checkPermissions) {
      switch (checkPermissions[permission]) {
        case RESULTS.BLOCKED:
          await Linking.openSettings();
          break;
        case RESULTS.DENIED:
          await Permissions.request(permission);
          break;
      }
    }

    checkPermissions = await Permissions.checkMultiple(BLE_PERMISSIONS);
    if (
      Object.values(checkPermissions).some(
        p => p !== RESULTS.GRANTED && p !== RESULTS.UNAVAILABLE,
      )
    ) {
      return false;
    }
    await BleManager.start({showAlert: true});
    return true;
  }

  async connect(id, timeout) {
    if (
      Platform.OS === 'ios' &&
      (await BleManager.isPeripheralConnected(id, []))
    ) {
      return;
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(), timeout ?? 32000);
      BleManager.connect(id)
        .then(() => {
          BleManager.retrieveServices(id)
            .then(() => {
              clearTimeout(timer);
              resolve();
            })
            .catch(e => {
              console.log('In the catch of BleManager retrieveServices', e);
              clearTimeout(timer);
              reject(e);
            });
        })
        .catch(a => {
          console.log('In the catch of the blemanager connect', a);
          reject(a);
        });
    });
  }

  async removeListeners(id) {
    this.eventHandlers.forEach((value, key) => {
      if (!key.includes(id)) {
        return;
      }
      value.remove();
      this.eventHandlers.delete(key);
    });
  }

  async sleep(m) {
    return new Promise(r => setTimeout(r, m));
  }

  async disconnect(id) {
    this.eventHandlers.forEach((value, key) => {
      if (!key.includes(id)) {
        return;
      }
    });
    await BleManager.disconnect(id);
    if (Platform.OS !== 'ios') {
      const peripheralConnected = await BleManager.isPeripheralConnected(
        id,
        [],
      );
      if (peripheralConnected) {
        await BleManager.removePeripheral(id);
      }
    }
  }

  async write(id, serviceUUID, characteristicUUID, data) {
    await this.connect(id);
    let parsedData = data;
    try {
      if (typeof data === 'string' || data instanceof String) {
        parsedData = stringToCharCode(data);
      } else if (!Array.isArray(data)) {
        parsedData = [data];
      }
      this.log(
        id,
        `Writing data: Parsed : ${parsedData} | Unparsed: ${data}`,
        serviceUUID,
        characteristicUUID,
      );

      await BleManager.write(
        id,
        serviceUUID,
        characteristicUUID,
        parsedData,
        data.length,
      );
    } catch (e) {
      logService.log(`Writing: ${e}`, 'Error');
      throw new Error(e);
    }
  }

  async read(id, serviceUUID, characteristicUUID) {
    await this.connect(id);
    try {
      const value = await BleManager.read(id, serviceUUID, characteristicUUID);
      this.log(
        id,
        `Reading data: Parsed : ${
          Array.isArray(value) ? String.fromCharCode(...value) : ''
        } | Unparsed: ${value}  `,
        serviceUUID,
        characteristicUUID,
      );
      return value;
    } catch (e) {
      logService.log(`Reading: ${e}`, 'Error');
      throw new Error(e);
    }
  }

  async notify(id, serviceUUID, characteristicUUID, callbackId, callback) {
    const key = `${characteristicUUID}-${id}-${callbackId}`;

    const remove = () => {
      if (this.eventHandlers.has(key)) {
        this.eventHandlers.get(key).remove();
      }
      this.eventHandlers.delete(key);
    };

    remove();
    this.eventHandlers.set(
      key,
      this.eventEmitter.addListener(BLE_NOTIFY_EVENT, e => {
        if (
          e.peripheral.toLowerCase() === id.toLowerCase() &&
          e.characteristic.toLowerCase() === characteristicUUID.toLowerCase() &&
          e.service.toLowerCase() === serviceUUID.toLowerCase()
        ) {
          callback(e.value, remove);
        }
      }),
    );

    await this.connect(id);
    await BleManager.startNotification(id, serviceUUID, characteristicUUID);

    return remove;
  }

  async pair(sensorName) {
    return new Promise((resolve, reject) => {
      const finished = async (success, id) => {
        if (!success) {
          let status = await BluetoothStateManager.getState();
          logService.log(
            `${id} | Did not connect to sensor | Bluetooth status: ${status} `,
          );
        }

        this.eventEmitter.removeAllListeners(BLE_DISCOVER_PERIPHERAL_EVENT);
        if (success) {
          resolve(id);
        } else {
          reject(id);
        }
      };

      const timer = setTimeout(() => finished(false, ''), 32000);

      this.eventEmitter.addListener(
        BLE_DISCOVER_PERIPHERAL_EVENT,
        ({id, name}) => {
          if (name !== `${sensorName}`) {
            return;
          }
          clearTimeout(timer);
          BleManager.stopScan()
            .then(() => {
              this.connect(id)
                .then(() => {
                  finished(true, id);
                })
                .catch(e => {
                  finished(false, id);
                });
            })
            .catch(e => {
              finished(false, id);
            });
        },
      );
      BleManager.scan([BleConstants.modelData.serviceUUID], 30, false);
    });
  }

  onDisconnect(callback) {
    const listener = this.eventEmitter.addListener(BLE_DISCONNECT_EVENT, e => {
      (async () => {
        await callback(e.peripheral);
      })();
    });
    return listener.remove;
  }

  async setToTransportMode(id) {
    const {serviceUUID, characteristicUUID} = BleConstants.sensorControlCmd;

    const byteArray = [0xad, 0xde];
    await this.write(id, serviceUUID, characteristicUUID, byteArray);
  }

  async getRSSI(id) {
    const rssi = await BleManager.readRSSI(id);

    this.log(id, `RSSI | Reading data: ${rssi}`);
    return rssi;
  }

  async getFirmwareRevision(id) {
    const {serviceUUID, characteristicUUID} = BleConstants.firmwareVersionData;

    const bytes = await this.read(id, serviceUUID, characteristicUUID);
    return String.fromCharCode(...bytes);
  }

  async getBatteryLevel(id) {
    const {serviceUUID, characteristicUUID} = BleConstants.batteryLevel;
    const level = await this.read(id, serviceUUID, characteristicUUID);

    return level[0];
  }
  async getDebugValue(id) {
    const {serviceUUID, characteristicUUID} = BleConstants.debug;
    const debugValue = await this.read(id, serviceUUID, characteristicUUID);

    return String.fromCharCode(...debugValue);
  }

  async getModelName(id) {
    const {serviceUUID, characteristicUUID} = BleConstants.modelData;

    const bytes = await this.read(id, serviceUUID, characteristicUUID);
    return String.fromCharCode(...bytes);
  }

  async onDebugValueChange(id, callbackId, callback) {
    const {serviceUUID, characteristicUUID} = BleConstants.debug;

    return this.notify(
      id,
      serviceUUID,
      characteristicUUID,
      callbackId,
      value => {
        callback(String.fromCharCode(...value));
      },
    );
  }

  async onBatteryLevelChange(id, callbackId, callback) {
    const {serviceUUID, characteristicUUID} = BleConstants.batteryLevel;
    return this.notify(
      id,
      serviceUUID,
      characteristicUUID,
      callbackId,
      value => {
        callback(value[0]);
      },
    );
  }
}
const bleService = new BleService();

export default bleService;
