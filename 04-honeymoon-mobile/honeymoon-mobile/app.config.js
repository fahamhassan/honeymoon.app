/**
 * Merges app.json and guarantees extra.apiUrl for Metro/runtime.
 * iOS ATS exception below applies to dev/production builds (EAS). Expo Go uses Expo’s own Info.plist — if login still fails only in Expo Go, run a dev build: `eas build --profile development`.
 */
const appJson = require('./app.json');

module.exports = () => {
  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL ||
    appJson.expo?.extra?.apiUrl ||
    'https://api.honeymoon.ae/api/v1';

  return {
    expo: {
      ...appJson.expo,
      ios: {
        ...appJson.expo.ios,
        infoPlist: {
          ...(appJson.expo.ios?.infoPlist || {}),
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: false,
            NSExceptionDomains: {
              'api.honeymoon.ae': {
                NSIncludesSubdomains: true,
                NSExceptionRequiresForwardSecrecy: false,
                NSExceptionMinimumTLSVersion: 'TLSv1.2',
              },
            },
          },
        },
      },
      extra: {
        ...(appJson.expo.extra || {}),
        apiUrl,
      },
    },
  };
};
