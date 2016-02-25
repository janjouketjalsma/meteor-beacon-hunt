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

// Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'icons/beacons.png',
  'iphone_2x': 'icons/beacons.png',
  'iphone_3x': 'icons/beacons.png',
  'ipad': 'icons/beacons.png',
  'ipad_2x': 'icons/beacons.png',
  'android_ldpi': 'icons/beacons.png',
  'android_mdpi': 'icons/beacons.png',
  'android_hdpi': 'icons/beacons.png',
  'android_xhdpi': 'icons/beacons.png'
});

App.launchScreens({
    'iphone': 'splash/splash.png',
    'iphone_2x': 'splash/splash.png',
    'iphone5': 'splash/splash.png',
    'iphone6': 'splash/splash.png',
    'iphone6p_portrait': 'splash/splash.png',
    'android_ldpi_portrait': 'splash/splash.png',
    'android_mdpi_portrait': 'splash/splash.png',
    'android_hdpi_portrait': 'splash/splash.png',
    'android_xhdpi_portrait': 'splash/splash.png'
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');

// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '1234567890',
  API_KEY: 'supersecretapikey'
});
