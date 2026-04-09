/**
 * API base URL order: .env EXPO_PUBLIC_API_URL → app.json extra.apiUrl → localhost (emulator only).
 * Until you own a domain, set EXPO_PUBLIC_API_URL in .env (see .env.example), e.g. your Vercel API.
 */
const appJson = require('./app.json');

module.exports = () => {
  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL ||
    appJson.expo?.extra?.apiUrl ||
    'http://localhost:5000/api/v1';

  return {
    expo: {
      ...appJson.expo,
      extra: {
        ...(appJson.expo.extra || {}),
        apiUrl,
      },
    },
  };
};
