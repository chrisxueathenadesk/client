const configForDevelopment = {
  responseTokenProp: 'token',
  baseUrl: 'http://localhost:3000/',
  logoutRedirect: '/',
  loginRoute: '/auth',
  signupRoute: '/auth/signup',
  profileUrl: '/me',
  tokenPrefix: ''
};

const configForProduction = {
  responseTokenProp: 'token',
  baseUrl: 'https://api.novelship.com/',
  logoutRedirect: '/',
  loginRoute: '/auth',
  signupRoute: '/auth/signup',
  profileUrl: '/me',
  tokenPrefix: ''
};

let authConfig;

if (window.location.hostname === 'localhost') {
  authConfig = configForDevelopment;
} else {
  authConfig = configForProduction;
}


export default authConfig;
