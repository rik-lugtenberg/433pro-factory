import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styles from './styles';
import {checkPermissionForCamera} from '../../helpers/permissionHelper';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import RNFetchBlob from 'rn-fetch-blob';
import bleService from '../../services/BleService';

function DetailsScreen(props) {
  const circlePassIcon = <Icon name="check-circle" size={30} color="white" />;
  const circleFailIcon = <Icon name="times-circle" size={30} color="white" />;
  const arrowRightIcon = <Icon name="arrow-right" size={25} color="white" />;

  const {sensor, resetSensor} = props;

  const passedCheck = sensor?.dbmValue > -60 && sensor.battery > 50;

  const onPressNextQRCode = async () => {
    const secretKey = 'MLMRUkY4ptwJhf2sY44BymlRaUiLrSjY';
    const label = 'Post Assembly Test';
    const test_id = sensor.dbmValue;
    const mac_address = sensor.id; // TODO IOS
    const serial = sensor.name;
    const pin = sensor.name.substring(2, sensor.name.length - 1);
    const hw_version = sensor.modelName;
    const result = passedCheck ? 'PASS' : 'FAIL';
    const app_firmware = sensor.firmware;

    if (passedCheck) {
      await bleService.setToTransportMode(sensor.id);
    }

    // const response = await RNFetchBlob.fetch(
    //   'POST',
    //   'http://puppygifs.tumblr.com/api/read/json',
    // );

    // const response = await RNFetchBlob.fetch(
    //   'POST',
    //   'https://admin.jogo.ai/api/get-hardware-logs',
    //   // {
    //   //   Accept: 'application/json',
    //   //   Authorization: `Bearer ${token}`,
    //   // },
    //   // payload
    // );

    await resetSensor();
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailsContainer}>
        <View style={styles.detailContainer}>
          <Text style={styles.detailHeader}>Connected</Text>
          <Text style={styles.detailValue}>
            {sensor.name ? sensor?.name : 'Loading'}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailHeader}>RSSI</Text>
          <Text style={styles.detailValue}>
            {sensor.dbmValue ? sensor?.dbmValue : 'Loading'}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailHeader}>Battery level</Text>
          <Text style={styles.detailValue}>
            {sensor.battery ? `${sensor.battery}%` : 'Loading'}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailHeader}>Model</Text>
          <Text style={styles.detailValue}>
            {sensor.modelName ? `${sensor.modelName}` : 'Loading'}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailHeader}>Firmware Version</Text>
          <Text style={styles.detailValue}>
            {sensor.firmware ? sensor.firmware : 'Loading'}
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <View
          style={[
            {
              ...styles.checkContainer,
              backgroundColor: sensor.name
                ? passedCheck
                  ? '#2ac902'
                  : '#cf0404'
                : '#808080',
            },
          ]}>
          <View style={styles.iconContainer}>
            {sensor.name ? (
              passedCheck ? (
                circlePassIcon
              ) : (
                circleFailIcon
              )
            ) : (
              <></>
            )}
          </View>
          <Text style={styles.checkText}>
            {sensor.name ? (passedCheck ? 'PASS' : 'FAIL') : 'LOADING...'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressNextQRCode}>
        <View style={styles.nextContainer}>
          <View style={styles.iconContainer}>{arrowRightIcon}</View>
          <Text style={styles.nextText}>Next</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default DetailsScreen;
