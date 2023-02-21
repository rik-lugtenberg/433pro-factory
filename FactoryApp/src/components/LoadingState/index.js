import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

import styles from '../../screens/ScanScreen/styles';
import {Color} from '../../theme';

export const LoadingState = ({showConnectingText}) => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator color={Color.yellow} size="large" />
    {showConnectingText && (
      <Text style={styles.secondaryText}>{'Connecting...'}</Text>
    )}
  </View>
);
