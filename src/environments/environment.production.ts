import {Environment} from './environment.interface';

export const environment: Environment = {
  name: 'production',
  production: true,
  apiKey: 'https://app.aemud.com',
  identity_API_URL: 'https://app.aemud.com',
  storage_API_URL: 'https://app.aemud.com',
  users_API_URL: 'https://app.aemud.com',
  API_URL: "/api/v1",
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
