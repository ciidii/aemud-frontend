import { Environment } from './environment.interface';

export const environment: Environment = {
  name: 'stage',
  production: true,
  apiKey: 'http://apiaemudcontainer:8081',
  identity_API_URL: 'https://stage.identity.com',
  storage_API_URL: 'https://stage.storage.com',
  users_API_URL: 'https://stage.user.com',
  API_URL:"/aemud/api/v1",
  features: [
    {
      name: 'loggingSystem',
      isActive: true,
      type: 'Sentry',
      sentryDsn: ''
    },
    {
      isActive: false,
      name: 'discount',
    },
  ]
};
