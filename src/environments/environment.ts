import { Environment } from './environment.interface';

export const environment: Environment = {
  name: 'stage',
  production: false ,
  apiKey: 'http://apiaemudcontainer:8081',
  identity_API_URL: 'https://identity.com',
  storage_API_URL: 'https://storage.com',
  users_API_URL: 'https://user.com',
  API_URL: "http://apiaemudcontainer:8081/aemud/api/v1",
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
