import { Platform, StyleSheet } from 'react-native';

const Fonts = StyleSheet.create({
  BSBold: {
    fontFamily: 'BioSans-Bold',
  },
  BSExtraBold: {
    fontFamily: 'BioSans-ExtraBold',
  },
  BSExtraLight: {
    fontFamily: 'BioSans-ExtraLight',
  },
  BSExtraItalic: {
    fontFamily: 'BioSans-Italic',
  },
  BSLight: {
    fontFamily: 'BioSans-Light',
  },
  BSRegular: {
    fontFamily: 'BioSans-Regular',
  },
  BSSemiBold: {
    fontFamily: 'BioSans-SemiBold',
  },
  BSBoldItalic: {
    fontFamily: Platform.select({
      ios: 'BioSansW04-BoldItalic',
      android: 'BioSans-BoldItalic',
    }),
  },

  DMSansRegular: {
    fontFamily: 'DMSans-Regular',
  },
  MonoSpecMedium: {
    fontFamily: 'MonoSpec-Medium',
  },
  SoccerJersey: {
    fontFamily: Platform.select({
      android: 'SoccerJersey',
      ios: 'Soccer Jersey Regular',
    }),
  },
  jerseyFont: {
    fontFamily: Platform.select({
      ios: 'Soccer-Jersey',
      android: 'SoccerJersey',
    }),
  },
});

export default Fonts;
