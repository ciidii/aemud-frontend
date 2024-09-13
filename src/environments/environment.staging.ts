export const environment = {
  name: 'stage',
  production: true,
  apiUrl: 'http://localhost:8080',
  identity_API_URL: 'https://stage.identity.com',
  storage_API_URL: 'https://stage.storage.com',
  users_API_URL: 'https://stage.user.com',
  features: [
    {
      name: 'loggingSystem',
      isActive: true,
      type: 'Sentry',
      sentryDsn:''
    },
    {
      isActive: false,
      name: 'discount',
    },
  ]
};
