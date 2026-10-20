import { Platform } from 'react-native';
import { FontDisplay } from 'expo-font';

export const fontFiles = {
  InstrumentSerif: { uri: require('../assets/fonts/InstrumentSerif-Regular.ttf'), display: FontDisplay.SWAP },
  RobotoRegular: { uri: require('../assets/fonts/Roboto_400Regular.ttf'), display: FontDisplay.SWAP },
  RobotoMedium: { uri: require('../assets/fonts/Roboto_500Medium.ttf'), display: FontDisplay.SWAP },
  RobotoBold: { uri: require('../assets/fonts/Roboto_700Bold.ttf'), display: FontDisplay.SWAP },
  RobotoTitle: { uri: require('../assets/fonts/Roboto_480Title.ttf'), display: FontDisplay.SWAP },
  RobotoDisplay: { uri: require('../assets/fonts/Roboto_880Display.ttf'), display: FontDisplay.SWAP },
};

export const iconFontFiles = {
  ionicons: { uri: require('../assets/fonts/Ionicons.ttf'), display: FontDisplay.SWAP },
  material: { uri: require('../assets/fonts/MaterialIcons.ttf'), display: FontDisplay.SWAP },
  'material-community': { uri: require('../assets/fonts/MaterialCommunityIcons.ttf'), display: FontDisplay.SWAP },
};

const SANS_FALLBACK = ', Roboto, "Segoe UI", "Helvetica Neue", Arial, sans-serif';
const SERIF_FALLBACK = ', Georgia, "Times New Roman", serif';
const withFallback = (face: string, stack: string) => (Platform.OS === 'web' ? `${face}${stack}` : face);

export const Fonts = {
  regular: withFallback('RobotoRegular', SANS_FALLBACK),
  medium: withFallback('RobotoMedium', SANS_FALLBACK),
  bold: withFallback('RobotoBold', SANS_FALLBACK),
  title: withFallback('RobotoTitle', SANS_FALLBACK),
  display: withFallback('RobotoDisplay', SANS_FALLBACK),
  serif: withFallback('InstrumentSerif', SERIF_FALLBACK),
};
