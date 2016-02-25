// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.meteorinflipflops.beaconhunter',
  name: 'Beacon Hunter',
  description: 'Find your beacons and get a reward',
  author: 'MeteorInFlipFlops',
  email: 'ricardo.pesciotta@gmail.com',
  website: 'http://linkedin.com/in/ricardopesciotta'
});

App.launchScreens({
  'iphone': 'resources/splash/splash.png',
  'iphone_2x':'resources/splash/splash.png',
'iphone5':'resources/splash/splash.png',
  'iphone6':'resources/splash/splash.png',
'iphone6p_portrait':'resources/splash/splash.png',
  'ipad_portrait': 'resources/splash/splash.png',
  'android_ldpi_portrait': 'resources/splash/splash.png',
'android_mdpi_portrait': 'resources/splash/splash.png',
'android_hdpi_portrait': 'resources/splash/splash.png',
'android_xhdpi_portrait': 'resources/splash/splash.png',
});

// Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'resources/icons/beacons.png',
  'iphone_2x': 'resources/icons/beacons.png',
  'iphone_3x': 'resources/icons/beacons.png',
  'ipad': 'resources/icons/beacons.png',
  'ipad_2x': 'resources/icons/beacons.png',
  'android_ldpi': 'resources/icons/beacons.png',
  'android_mdpi': 'resources/icons/beacons.png',
  'android_hdpi': 'resources/icons/beacons.png',
  'android_xhdpi': 'resources/icons/beacons.png'
});


// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0x2021460');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'portrait');