export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8080/api',
  auth: {
    loginEndpoint: '/auth/authenticate',
    registerEndpoint: '/auth/register',
    contextEndpoint: '/auth/context',
    changePasswordEndpoint: '/users/password'
  },
  products: {
    baseEndpoint: '/v2/products'
  },
  categories: {
    baseEndpoint: '/categories'
  }
};
