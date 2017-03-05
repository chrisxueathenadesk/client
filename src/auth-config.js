const configForDevelopment = {
  responseTokenProp: 'token',
  baseUrl: 'http://localhost:3000/',
  logoutRedirect: '/#/auth/login',
  loginRoute: '/#/auth',
  signupRoute: '/#/auth/signup',
  profileUrl: '/me',
  tokenPrefix: ''
};

const configForProduction = {
  responseTokenProp: 'token',
  baseUrl: 'https://novelship.herokuapp.com',
  logoutRedirect: '/#/auth/login',
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
