import {StyleSheet} from 'react-native';

import {Color, Fonts, Metrics} from '../../theme';

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: Color.black},
  cameraStyle: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryText: {
    color: Color.white,
    marginTop: 20,
    fontSize: Metrics.screenWidth * 0.06,
  },
  marker: {
    width: Metrics.screenWidth * 0.6,
    height: Metrics.screenWidth * 0.6,
    borderColor: Color.yellow,
    borderWidth: 3,
  },
  headerWrapper: {
    width: '100%',
    position: 'absolute',
    top: '8%',
    zIndex: 100,
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  headerText: {
    fontSize: 25,
    color: 'white',
    fontWeight: '800'
  },
  headerButtons: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: Color.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icons: {
    color: Color.black,
    fontSize: 20,
  },
});

export default styles;
