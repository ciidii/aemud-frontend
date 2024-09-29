export const environment = {
  name: 'stage',
  production: true,
  apiKey: 'http://localhost:8080',
  identity_API_URL: 'https://identity.com',
  storage_API_URL: 'https://storage.com',
  users_API_URL: 'https://user.com',
  API_URL: "http://localhost:8080/aemud/api/v1",
  features: [
    {
      name: 'loggingSystem',
      isActive: true,
      type: 'Sentry',
    },
    {
      isActive: false,
      name: 'discount',
    },
  ]
};
