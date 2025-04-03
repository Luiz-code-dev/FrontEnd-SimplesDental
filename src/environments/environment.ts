export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  auth: {
    baseEndpoint: '/auth',
    loginEndpoint: '/authenticate',
    registerEndpoint: '/register',
    contextEndpoint: '/context',
    changePasswordEndpoint: '/change-password'
  },
  products: {
    baseEndpoint: '/products'
  },
  categories: {
    baseEndpoint: '/categories'
  },
  users: {
    baseEndpoint: '/users'
  }
};
