export const environment = {
  name: 'stage',
  production: true,
  apiUrl: 'http://apiaemudcontainer:8081',
  identity_API_URL: 'https://stage.identity.com',
  storage_API_URL: 'https://stage.storage.com',
  users_API_URL: 'https://stage.user.com',
  API_URL:"http://apiaemudcontainer:8081/aemud/api/v1",
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
