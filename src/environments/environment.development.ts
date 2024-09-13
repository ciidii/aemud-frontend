export const environment = {
  name: 'developments',
  production: true,
  apiKey: 'http://localhost:8080',
  identity_API_URL: 'https://dev.identity.com',
  storage_API_URL: 'https://dev.storage.com',
  users_API_URL: 'https://dev.user.com',
  features: [
    {
      name: 'loggingSystem',
      isActive: true,
      type: 'Sentry',
      sentryDsn:"https://81b5e760448239131fa0c5be4700fe12:4f778f49e5771f85b0c735a9bc0674d2@o4507900223160320.ingest.us.sentry.io/4507901011558400"
    },
    {
      isActive: false,
      name: 'discount',
    },
  ]
};
