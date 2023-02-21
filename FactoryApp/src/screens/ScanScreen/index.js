import QRCodeScanner from 'react-native-qrcode-scanner';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {checkPermissionForCamera} from '../../helpers/permissionHelper';
import bleService from '../../services/BleService';
import {LoadingState} from '../../components/LoadingState';

function ScanScreen(props) {
  const [loading, setLoading] = useState(false);

  const getSensorName = data => {
    return `JS_${data.slice(data.indexOf('_') + 1, data.lastIndexOf('_'))}`;
  };

  const getSensorKey = data => {
    const splitArray = data.split('_');
    return splitArray[splitArray.length - 1];
  };

  const onQrCodeScanned = async event => {
    const {data} = event;

    setLoading(true);
    try {
      if (
        !data ||
        typeof data !== 'string' ||
        data.indexOf('_') === data.lastIndexOf('_')
      ) {
        return;
      }
      const newSensorName = getSensorName(data);
      const id = await bleService.pair(newSensorName);

      // const removeDisconnect = bleService.onDisconnect(async id => {
      //   console.log('is going to disconnect!!!!', id);
      // });

      if (props.onScan) {
        await props.onScan(id, newSensorName);
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <View style={styles.mainContainer}>
      {!loading && (
        <>
          <View style={styles.headerWrapper}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Scan The sensor QR Code</Text>
            </View>
          </View>
          <QRCodeScanner
            onRead={onQrCodeScanned}
            showMarker
            reactivate
            reactivateTimeout={400}
            customMarker={<View style={styles.marker} />}
          />
        </>
      )}
      {loading && <LoadingState showConnectingText />}
    </View>
  );
}

export default ScanScreen;
