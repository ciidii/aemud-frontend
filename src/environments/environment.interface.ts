export interface Environment {
  name: string;
  production: boolean;
  apiKey: string;
  identity_API_URL: string;
  storage_API_URL: string;
  users_API_URL: string;
  API_URL: string;
  features: {
    name: string;
    isActive: boolean;
    type?: string;
    sentryDsn?: string;
  }[];
}
