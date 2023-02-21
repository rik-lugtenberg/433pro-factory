import {AppRegistry} from 'react-native';
import App from './App';
import logService from './src/services/LogService';
import {name as appName} from './app.json';
import {LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shipbook from '@shipbook/react-native';

(async () => {
  AppRegistry.registerComponent(appName, () => App);
  logService.initilize()
})();
