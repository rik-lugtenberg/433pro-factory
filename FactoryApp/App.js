import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, LogBox, View, AppState} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import ScanScreen from './src/screens/ScanScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import bleService from './src/services/BleService';
import {checkPermissionForCamera} from './src/helpers/permissionHelper';
import logService from './src/services/LogService';

const defaultSensorValues = {
  dbmValue: null,
  battery: null,
  id: null,
  firmware: null,
  modelName: null,
  name: null,
};

export default function App() {
  const [scannedId, setScannedId] = useState(null);
  const [sensor, setSensor] = useState(defaultSensorValues);
  const [permissionsAreGranted, setPermissionsAreGranted] = useState(false);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    (async () => {
      await checkPermissions();
    })();
  }, []);

  const checkPermissions = async () => {
    const blePermissions = await bleService.initialize();
    const cameraPermissions = await checkPermissionForCamera();
    setPermissionsAreGranted(cameraPermissions && blePermissions);
  };

  const handleAppStateChange = async nextAppState => {
    if (nextAppState === 'active') {
      await checkPermissions();
    }
  };

  const resetSensor = async () => {
    setScannedId(null);
    setSensor(defaultSensorValues);
  };

  const onScan = async (id, sensorName) => {
    setScannedId(id);

    let newSensor = {};
    newSensor.id = id;
    newSensor.name = sensorName;
    newSensor.firmware = await bleService.getFirmwareRevision(id);
    newSensor.battery = await bleService.getBatteryLevel(id);
    newSensor.dbmValue = await bleService.getRSSI(id);
    newSensor.modelName = await bleService.getModelName(id);
    setSensor(newSensor);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {permissionsAreGranted ? (
          scannedId ? (
            <DetailsScreen resetSensor={resetSensor} sensor={sensor} />
          ) : (
            <ScanScreen onScan={onScan} />
          )
        ) : (
          <View></View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
