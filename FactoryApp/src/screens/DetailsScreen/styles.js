import {StyleSheet, Dimensions} from 'react-native';

import {Color, Fonts, Metrics} from '../../theme';

var totalWidth = Dimensions.get('window').width;

const detailsWidth = (totalWidth / 100) * 80;
const checkWidth = (totalWidth / 100) * 60;
const continueWidth = (totalWidth / 100) * 50;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  detailsContainer: {
    flex: 0.7,
    minWidth: 300,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: detailsWidth,
  },
  detailContainer: {
    alignItems: 'center',
  },
  detailHeader: {color: '#FFFFFF', fontSize: 20},
  detailValue: {color: '#FFFFFF', fontSize: 20, fontWeight: '700'},
  checkContainer: {
    display: 'flex',
    height: 80,
    width: checkWidth,
    verticalAlign: 'middle',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
  },
  checkText: {
    verticalAlign: 'middle',
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
  },
  nextContainer: {
    height: 60,
    width: continueWidth,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#1aa3ff',
    display: 'flex',
    flexDirection: 'row',
  },
  nextText: {
    display: 'flex',
    verticalAlign: 'middle',
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  iconContainer: {
    justifyContent: 'center',
    marginRight: 10,
  },
});

export default styles;
