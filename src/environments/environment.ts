export const environment = {
  production: false,
  uri: 'http://localhost:3000',
  adalConfig: {
    tenant: '0f9e35db-544f-4f60-bdcc-5ea416e6dc70',
    clientId: '3dc70ba7-8565-4ca0-8a1d-284a8ec49c10',
    endpoints: {
      'https://graph.microsoft.com': '9ba9394d-f635-4ca7-907e-1fd9252a23b7',
    },
    cacheLocation: 'localStorage',
  },
  fakeUser: {
    enabled: true,
    userName: 'caruso@un.org',
  },
  sendTokenToBackend: false,
  version: '1.0',
};
