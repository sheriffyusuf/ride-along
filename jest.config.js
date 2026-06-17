module.exports = {
  preset: 'jest-expo',
  // pnpm stores real packages under node_modules/.pnpm/<pkg>/node_modules/<pkg>
  // so we need to allow transformation of both the normal and the .pnpm paths.
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '\\.pnpm/|' +
      '(jest-)?react-native|' +
      '@react-native(-community)?/|' +
      '@react-native/js-polyfills|' +
      'expo(nent)?|' +
      '@expo(nent)?/|' +
      '@expo-google-fonts/|' +
      'react-navigation|' +
      '@react-navigation/|' +
      '@unimodules/|' +
      'unimodules|' +
      'native-base|' +
      'react-native-svg|' +
      '@maplibre/' +
      '))',
  ],
};
