define('app',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-auth', './services/user'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaAuth, _user) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _aureliaAuth.FetchConfig, _aureliaAuth.AuthService, _user.UserService), _dec(_class = function () {
    function App(router, fetchConfig, auth, user) {
      _classCallCheck(this, App);

      this.fetchConfig = fetchConfig;
      this.auth = auth;
      this.user = user;
    }

    App.prototype.activate = function activate() {
      var _this = this;

      this.fetchConfig.configure();

      if (this.auth.isAuthenticated()) {
        this.auth.getMe().then(function (profile) {
          _this.user.save(profile);
        }).catch(function (err) {
          console.log(err);
        });
      }
    };

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Rad Ship';
      config.addPipelineStep('authorize', _aureliaAuth.AuthorizeStep);
      config.map([{
        route: '',
        redirect: 'requests'
      }, {
        route: 'requests',
        name: 'requests',
        moduleId: 'views/requests/index',
        nav: true,
        title: 'Requests'
      }, {
        route: 'user',
        name: 'user',
        moduleId: 'views/user/index',
        nav: true,
        auth: true,
        title: 'Dashboard'
      }, {
        route: 'auth',
        name: 'auth',
        moduleId: 'views/login/index',
        title: 'Login'
      }]);

      this.router = router;
    };

    return App;
  }()) || _class);
});
define('auth-config',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var configForDevelopment = {
    responseTokenProp: 'token',
    baseUrl: 'http://localhost:3000/',
    logoutRedirect: '/#/auth/login',
    loginRoute: '/#/auth',
    signupRoute: '/#/auth/signup',
    profileUrl: '/me',
    tokenPrefix: ''
  };

  var configForProduction = {
    responseTokenProp: 'token',
    baseUrl: 'http://radship.com',
    logoutRedirect: '/#/auth/login',
    profileUrl: '/me',
    tokenPrefix: ''
  };

  var authConfig = void 0;

  if (window.location.hostname === 'localhost') {
    authConfig = configForDevelopment;
  } else {
    authConfig = configForProduction;
  }

  exports.default = authConfig;
});
define('environment',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: false,
    testing: false,
    base: 'https://radship.herokuapp.com/'
  };
});
define('main',['exports', './environment', 'aurelia-fetch-client', './auth-config'], function (exports, _environment, _aureliaFetchClient, _authConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var _authConfig2 = _interopRequireDefault(_authConfig);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().plugin('aurelia-dialog', function (dialogConfig) {
      return dialogConfig.useDefaults();
    }).plugin('aurelia-auth', function (baseConfig) {
      baseConfig.configure(_authConfig2.default);
    }).feature('resources');

    var http = new _aureliaFetchClient.HttpClient();
    http.configure(function (config) {
      return config.useStandardConfiguration().withBaseUrl(_environment2.default.base);
    });

    aurelia.container.registerInstance(_aureliaFetchClient.HttpClient, http);

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('models/api',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-path'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaPath) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Api = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Api = exports.Api = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
    function Api(http) {
      _classCallCheck(this, Api);

      this.http = http;
    }

    Api.formatFilters = function formatFilters(filterObj) {
      var formattedFilter = {};
      Object.keys(filterObj).forEach(function (key) {
        formattedFilter['where[' + key + ']'] = filterObj[key];
      });
      return formattedFilter;
    };

    Api.prototype._getQuery = function _getQuery(path, params) {
      if (!params) {
        return path;
      }

      var query = path + '?';

      if (params.filter && Object.keys(params.filter).length) {
        query = '' + query + (0, _aureliaPath.buildQueryString)(Api.formatFilters(params.filter, 'where'));
      }

      if (params.include.length) {
        var includeQuery = { include: '[' + params.include.join(',') + ']' };
        query = query + '&' + (0, _aureliaPath.buildQueryString)(includeQuery);
      }

      if (params.page) {
        query = query + '&page[number]=' + params.page.number + '&page[size]=' + params.page.size;
      }

      if (params.sort) {
        query = query + '&sort=' + params.sort;
      }

      return query;
    };

    Api.prototype.fetch = function fetch(path, params) {
      return this.http.fetch(this._getQuery(path, params)).then(function (response) {
        return response.json();
      });
    };

    Api.prototype.create = function create(path, body) {
      return this.http.fetch(path, {
        method: 'POST',
        body: (0, _aureliaFetchClient.json)(body)
      }).then(function (response) {
        return response.json();
      });
    };

    return Api;
  }()) || _class);
});
define('models/base',['exports', 'aurelia-fetch-client', 'aurelia-path'], function (exports, _aureliaFetchClient, _aureliaPath) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Base = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Base = exports.Base = function () {
    function Base(http, path) {
      _classCallCheck(this, Base);

      this.path = path;
      this.http = http;
    }

    Base.prototype.retrieve = function retrieve(include) {
      var query = this.path;
      if (include && include.length) {
        var includeQuery = { include: '[' + include.join(',') + ']' };
        query = query + '&' + (0, _aureliaPath.buildQueryString)(includeQuery);
      }
      return this.http.fetch(query).then(function (response) {
        return response.json();
      });
    };

    Base.prototype.update = function update(body) {
      return this.http.fetch(this.path, {
        method: 'PUT',
        body: (0, _aureliaFetchClient.json)(body)
      }).then(function (response) {
        return response.json();
      });
    };

    Base.prototype.destroy = function destroy() {
      return this.http.fetch(this.path, {
        method: 'DELETE'
      }).then(function (response) {
        return response.json();
      });
    };

    return Base;
  }();
});
define('models/country',['exports', 'aurelia-framework', 'aurelia-fetch-client', './base'], function (exports, _aureliaFramework, _aureliaFetchClient, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Country = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _dec, _class;

  var Country = exports.Country = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function (_Base) {
    _inherits(Country, _Base);

    function Country(http, id) {
      _classCallCheck(this, Country);

      var path = 'countries/' + id;
      return _possibleConstructorReturn(this, _Base.call(this, http, path));
    }

    return Country;
  }(_base.Base)) || _class);
});
define('models/request',['exports', 'aurelia-framework', 'aurelia-fetch-client', './base'], function (exports, _aureliaFramework, _aureliaFetchClient, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Request = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _dec, _class;

  var Request = exports.Request = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function (_Base) {
    _inherits(Request, _Base);

    function Request(http, id) {
      _classCallCheck(this, Request);

      var path = 'requests/' + id;
      return _possibleConstructorReturn(this, _Base.call(this, http, path));
    }

    return Request;
  }(_base.Base)) || _class);
});
define('resources/index',['exports', './elements/index'], function (exports, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _index2 = _interopRequireDefault(_index);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resources = {
    elements: _index2.default
  };

  var allResources = Object.values(resources).reduce(function (all, resource) {
    return all.concat(resource);
  }, []);

  function configure(config) {
    config.globalResources(allResources);
  }
});
define('services/user',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var UserService = exports.UserService = function () {
    function UserService() {
      _classCallCheck(this, UserService);
    }

    UserService.prototype.save = function save(user) {
      this._user = user;
    };

    UserService.prototype.clear = function clear() {
      this._user = undefined;
    };

    _createClass(UserService, [{
      key: "user",
      get: function get() {
        return this._user;
      }
    }]);

    return UserService;
  }();
});
define('resources/elements/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var elements = ['filter/filter', 'navbar/navbar', 'signin/signin'];

  exports.default = elements.map(function (elem) {
    return './elements/' + elem;
  });
});
define('views/login/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LoginRouter = exports.LoginRouter = function () {
    function LoginRouter() {
      _classCallCheck(this, LoginRouter);
    }

    LoginRouter.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: '', redirect: 'login' }, { route: 'login', name: 'login', moduleId: './login', nav: true }, { route: 'signup', name: 'signup', moduleId: './signup', nav: true }, { route: 'reset', name: 'reset', moduleId: './reset', nav: true }]);
    };

    return LoginRouter;
  }();
});
define('views/login/login',['exports', 'aurelia-framework', '../../models/api', 'aurelia-auth', '../../services/user'], function (exports, _aureliaFramework, _api, _aureliaAuth, _user) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService, _api.Api, _user.UserService), _dec(_class = function () {
    function Login(auth, api, user) {
      _classCallCheck(this, Login);

      this.auth = auth;
      this.api = api;
      this.user = user;
    }

    Login.prototype.login = function login() {
      var _this = this;

      return this.auth.login(this.email, this.password).then(function (response) {
        _this.auth.getMe().then(function (user) {
          return _this.user.save(user);
        }).catch(function (err) {
          return console.log(err);
        });
      }).catch(function (err) {
        return console.log(err);
      });
    };

    return Login;
  }()) || _class);
});
define('views/login/reset',['exports', 'aurelia-framework', '../../models/api'], function (exports, _aureliaFramework, _api) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Reset = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Reset = exports.Reset = (_dec = (0, _aureliaFramework.inject)(_api.Api), _dec(_class = function Reset() {
    _classCallCheck(this, Reset);
  }) || _class);
});
define('views/login/signup',['exports', 'aurelia-framework', '../../models/api'], function (exports, _aureliaFramework, _api) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Signup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_api.Api), _dec(_class = function Signup() {
    _classCallCheck(this, Signup);
  }) || _class);
});
define('views/requests/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var RequestsRouter = exports.RequestsRouter = function () {
    function RequestsRouter() {
      _classCallCheck(this, RequestsRouter);

      this.heading = 'Requests';
    }

    RequestsRouter.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: '', moduleId: './requests', nav: true, title: 'Requests' }, { route: '/:request_id', name: 'request', moduleId: './request/index', title: 'Request' }]);
    };

    return RequestsRouter;
  }();
});
define('views/requests/requests',['exports', 'aurelia-framework', '../../models/api'], function (exports, _aureliaFramework, _api) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RequestView = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var RequestView = exports.RequestView = (_dec = (0, _aureliaFramework.inject)(_api.Api), _dec(_class = function () {
    function RequestView(api) {
      _classCallCheck(this, RequestView);

      this.api = api;
      this.requests = {
        params: {
          filter: {},
          include: [],
          page: {
            size: 12,
            number: 0
          },
          sort: '-id'
        }
      };
      this.countries = {};
    }

    RequestView.prototype.getRequests = function getRequests(params) {
      var _this = this;

      this.api.fetch('requests', params).then(function (items) {
        _this.requests.data = items.results;
      }).catch(function (error) {
        _this.requests.error = error;
      });
    };

    RequestView.prototype.getCountries = function getCountries() {
      var _this2 = this;

      this.api.fetch('countries').then(function (items) {
        _this2.countries.data = items.results;
      }).catch(function (error) {
        _this2.countries.error = error;
      });
    };

    RequestView.prototype.activate = function activate() {
      this.getRequests(this.requests.params);
      this.getCountries();
    };

    return RequestView;
  }()) || _class);
});
define('views/user/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var UserRouter = exports.UserRouter = function () {
    function UserRouter() {
      _classCallCheck(this, UserRouter);

      this.heading = 'User';
    }

    UserRouter.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: '', redirect: 'requests' }, { route: '/trips', moduleId: './trips/index', nav: true, title: 'Trips' }, { route: '/requests', moduleId: './requests/index', nav: true, title: 'Requests' }]);
    };

    return UserRouter;
  }();
});
define('resources/elements/filter/filter',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Filter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

  var Filter = exports.Filter = (_class = function () {
    function Filter() {
      _classCallCheck(this, Filter);

      _initDefineProp(this, 'values', _descriptor, this);

      _initDefineProp(this, 'model', _descriptor2, this);

      _initDefineProp(this, 'change', _descriptor3, this);
    }

    Filter.prototype.onChange = function onChange() {
      console.log(this.model);
      this.model.params.where['platform:eq'] = 2;
      this.change();
    };

    return Filter;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'values', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'model', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'change', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('resources/elements/navbar/navbar',['exports', 'aurelia-framework', '../../../services/user', 'aurelia-auth'], function (exports, _aureliaFramework, _user, _aureliaAuth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Navbar = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var Navbar = exports.Navbar = (_dec = (0, _aureliaFramework.inject)(_user.UserService, _aureliaAuth.AuthService), _dec(_class = (_class2 = function () {
    function Navbar(userStore, auth) {
      _classCallCheck(this, Navbar);

      _initDefineProp(this, 'router', _descriptor, this);

      this.auth = auth;
      this.userStore = userStore;
    }

    Navbar.prototype.logout = function logout() {
      this.auth.logout();
      this.userStore.clear();
    };

    return Navbar;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'router', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/signin/signin',['exports', 'aurelia-dialog', 'aurelia-framework'], function (exports, _aureliaDialog, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Signin = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Signin = exports.Signin = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
    function Signin(controller) {
      _classCallCheck(this, Signin);

      this.person = {};

      this.controller = controller;
    }

    Signin.prototype.activate = function activate(person) {
      this.person = person;
    };

    Signin.prototype.login = function login() {
      return 'hello';
    };

    return Signin;
  }()) || _class);
});
define('views/requests/request/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var RequestRouter = exports.RequestRouter = function () {
    function RequestRouter() {
      _classCallCheck(this, RequestRouter);
    }

    RequestRouter.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: '', moduleId: './request', nav: true, title: 'Request' }]);
    };

    return RequestRouter;
  }();
});
define('views/requests/request/request',['exports', 'aurelia-framework', '../../../models/request', '../../../models/api'], function (exports, _aureliaFramework, _request, _api) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RequestView = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var RequestView = exports.RequestView = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Factory.of(_request.Request), _api.Api), _dec(_class = function () {
    function RequestView(requestFactory, api) {
      _classCallCheck(this, RequestView);

      this.api = api;
      this.factory = requestFactory;
      this.request = {
        params: {
          include: ['source', 'destination']
        }
      };
    }

    RequestView.prototype.getRequest = function getRequest(id) {
      var _this = this;

      this.api.fetch('requests/' + id + '/', this.request.params).then(function (request) {
        _this.request.data = request;
      }).catch(function (error) {
        _this.request.error = error;
      });
    };

    RequestView.prototype.activate = function activate(params) {
      var id = Number(params.request_id);
      this.currentRequest = this.factory(id);
      this.getRequest(id);
    };

    return RequestView;
  }()) || _class);
});
define('views/user/requests/create',['exports', 'aurelia-framework', '../../../models/api'], function (exports, _aureliaFramework, _api) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CreateRequest = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var CreateRequest = exports.CreateRequest = (_dec = (0, _aureliaFramework.inject)(_api.Api), _dec(_class = function () {
    function CreateRequest(api) {
      _classCallCheck(this, CreateRequest);

      this.api = api;
      this.countries = {};
      this.request = {};
    }

    CreateRequest.prototype.fetchCountries = function fetchCountries() {
      var _this = this;

      this.api.fetch('countries').then(function (countries) {
        _this.countries.data = countries.results;
      }).catch(function (err) {
        _this.countries.error = err;
      });
    };

    CreateRequest.prototype.create = function create() {
      this.api.create('me/requests', this.request).then(function (response) {
        console.log(response);
      }).catch(function (err) {
        console.log(err);
      });
    };

    CreateRequest.prototype.activate = function activate() {
      this.fetchCountries();
    };

    return CreateRequest;
  }()) || _class);
});
define('views/user/requests/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var RequestsRouter = exports.RequestsRouter = function () {
    function RequestsRouter() {
      _classCallCheck(this, RequestsRouter);

      this.heading = 'Requests';
    }

    RequestsRouter.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: '', moduleId: './requests', nav: true, title: 'Requests' }, { route: '/create', name: 'create-request', moduleId: './create', nav: true, title: 'Create' }]);
    };

    return RequestsRouter;
  }();
});
define('views/user/requests/requests',['exports', 'aurelia-framework', '../../../models/api'], function (exports, _aureliaFramework, _api) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RequestsView = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var RequestsView = exports.RequestsView = (_dec = (0, _aureliaFramework.inject)(_api.Api), _dec(_class = function () {
    function RequestsView(api) {
      _classCallCheck(this, RequestsView);

      this.api = api;
      this.requests = {};
    }

    RequestsView.prototype.activate = function activate() {
      var _this = this;

      this.api.fetch('me/requests').then(function (requests) {
        _this.requests.data = requests.results;
      }).catch(function (err) {
        _this.requests.error = err;
      });
    };

    return RequestsView;
  }()) || _class);
});
define('views/user/trips/trips',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TripsView = exports.TripsView = function TripsView() {
    _classCallCheck(this, TripsView);
  };
});
define('views/requests/components/request-card/request-card',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RequestCard = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var RequestCard = exports.RequestCard = (_dec = (0, _aureliaFramework.containerless)(), _dec(_class = (_class2 = function RequestCard() {
    _classCallCheck(this, RequestCard);

    _initDefineProp(this, 'request', _descriptor, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'request', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('views/requests/components/countries/countries',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PlatformFilter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

  var PlatformFilter = exports.PlatformFilter = (_class = function () {
    function PlatformFilter() {
      _classCallCheck(this, PlatformFilter);

      _initDefineProp(this, 'values', _descriptor, this);

      _initDefineProp(this, 'store', _descriptor2, this);

      _initDefineProp(this, 'change', _descriptor3, this);
    }

    PlatformFilter.prototype.onChange = function onChange(value) {
      this.store.params.filter['platform.id:eq'] = value;
      this.change({ params: this.store.params });
    };

    return PlatformFilter;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'values', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'store', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'change', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('views/requests/components/search/search',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Search = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var Search = exports.Search = (_class = function Search() {
    _classCallCheck(this, Search);

    _initDefineProp(this, 'model', _descriptor, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'model', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('views/user/requests/request/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var RequestRouter = exports.RequestRouter = function () {
    function RequestRouter() {
      _classCallCheck(this, RequestRouter);

      this.heading = 'Request';
    }

    RequestRouter.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: '', redirect: 'request' }, { route: '/create', moduleId: './create', nav: true, title: 'Create' }, { route: '/:request_id', moduleId: './request', nav: true, title: 'Request' }]);
    };

    return RequestRouter;
  }();
});
define('views/user/requests/request/request',[], function () {});
define('views/user/trips/trip/trip',[], function () {});
define('aurelia-auth/auth-service',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', './authentication', './base-config', './oAuth1', './oAuth2', './auth-utilities'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _aureliaEventAggregator, _authentication, _baseConfig, _oAuth, _oAuth2, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthService = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthService = exports.AuthService = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _oAuth.OAuth1, _oAuth2.OAuth2, _baseConfig.BaseConfig, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AuthService(http, auth, oAuth1, oAuth2, config, eventAggregator) {
      _classCallCheck(this, AuthService);

      this.http = http;
      this.auth = auth;
      this.oAuth1 = oAuth1;
      this.oAuth2 = oAuth2;
      this.config = config.current;
      this.tokenInterceptor = auth.tokenInterceptor;
      this.eventAggregator = eventAggregator;
    }

    AuthService.prototype.getMe = function getMe() {
      var profileUrl = this.auth.getProfileUrl();
      return this.http.fetch(profileUrl).then(_authUtilities.status);
    };

    AuthService.prototype.isAuthenticated = function isAuthenticated() {
      return this.auth.isAuthenticated();
    };

    AuthService.prototype.getTokenPayload = function getTokenPayload() {
      return this.auth.getPayload();
    };

    AuthService.prototype.setToken = function setToken(token) {
      this.auth.setToken(Object.defineProperty({}, this.config.tokenName, { value: token }));
    };

    AuthService.prototype.signup = function signup(displayName, email, password) {
      var _this = this;

      var signupUrl = this.auth.getSignupUrl();
      var content = void 0;
      if (_typeof(arguments[0]) === 'object') {
        content = arguments[0];
      } else {
        content = {
          'displayName': displayName,
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(signupUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.loginOnSignup) {
          _this.auth.setToken(response);
        } else if (_this.config.signupRedirect) {
          window.location.href = _this.config.signupRedirect;
        }
        _this.eventAggregator.publish('auth:signup', response);
        return response;
      });
    };

    AuthService.prototype.login = function login(email, password) {
      var _this2 = this;

      var loginUrl = this.auth.getLoginUrl();
      var content = void 0;
      if (typeof arguments[1] !== 'string') {
        content = arguments[0];
      } else {
        content = {
          'email': email,
          'password': password
        };
      }

      return this.http.fetch(loginUrl, {
        method: 'post',
        headers: typeof content === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
        body: typeof content === 'string' ? content : (0, _aureliaFetchClient.json)(content)
      }).then(_authUtilities.status).then(function (response) {
        _this2.auth.setToken(response);
        _this2.eventAggregator.publish('auth:login', response);
        return response;
      });
    };

    AuthService.prototype.logout = function logout(redirectUri) {
      var _this3 = this;

      return this.auth.logout(redirectUri).then(function () {
        _this3.eventAggregator.publish('auth:logout');
      });
    };

    AuthService.prototype.authenticate = function authenticate(name, redirect, userData) {
      var _this4 = this;

      var provider = this.oAuth2;
      if (this.config.providers[name].type === '1.0') {
        provider = this.oAuth1;
      }

      return provider.open(this.config.providers[name], userData || {}).then(function (response) {
        _this4.auth.setToken(response, redirect);
        _this4.eventAggregator.publish('auth:authenticate', response);
        return response;
      });
    };

    AuthService.prototype.unlink = function unlink(provider) {
      var _this5 = this;

      var unlinkUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

      if (this.config.unlinkMethod === 'get') {
        return this.http.fetch(unlinkUrl + provider).then(_authUtilities.status).then(function (response) {
          _this5.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      } else if (this.config.unlinkMethod === 'post') {
        return this.http.fetch(unlinkUrl, {
          method: 'post',
          body: (0, _aureliaFetchClient.json)(provider)
        }).then(_authUtilities.status).then(function (response) {
          _this5.eventAggregator.publish('auth:unlink', response);
          return response;
        });
      }
    };

    return AuthService;
  }()) || _class);
});
define('aurelia-auth/authentication',['exports', 'aurelia-dependency-injection', './base-config', './storage', './auth-utilities'], function (exports, _aureliaDependencyInjection, _baseConfig, _storage, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Authentication = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _class;

  var Authentication = exports.Authentication = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _baseConfig.BaseConfig), _dec(_class = function () {
    function Authentication(storage, config) {
      _classCallCheck(this, Authentication);

      this.storage = storage;
      this.config = config.current;
      this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
      this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
    }

    Authentication.prototype.getLoginRoute = function getLoginRoute() {
      return this.config.loginRoute;
    };

    Authentication.prototype.getLoginRedirect = function getLoginRedirect() {
      return this.initialUrl || this.config.loginRedirect;
    };

    Authentication.prototype.getLoginUrl = function getLoginUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    };

    Authentication.prototype.getSignupUrl = function getSignupUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    };

    Authentication.prototype.getProfileUrl = function getProfileUrl() {
      return this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    };

    Authentication.prototype.getToken = function getToken() {
      return this.storage.get(this.tokenName);
    };

    Authentication.prototype.getPayload = function getPayload() {
      var token = this.storage.get(this.tokenName);
      return this.decomposeToken(token);
    };

    Authentication.prototype.decomposeToken = function decomposeToken(token) {
      if (token && token.split('.').length === 3) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        try {
          return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        } catch (error) {
          return null;
        }
      }
    };

    Authentication.prototype.setInitialUrl = function setInitialUrl(url) {
      this.initialUrl = url;
    };

    Authentication.prototype.setToken = function setToken(response, redirect) {
      var accessToken = response && response[this.config.responseTokenProp];
      var tokenToStore = void 0;

      if (accessToken) {
        if ((0, _authUtilities.isObject)(accessToken) && (0, _authUtilities.isObject)(accessToken.data)) {
          response = accessToken;
        } else if ((0, _authUtilities.isString)(accessToken)) {
          tokenToStore = accessToken;
        }
      }

      if (!tokenToStore && response) {
        tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
      }

      if (tokenToStore) {
        this.storage.set(this.tokenName, tokenToStore);
      }

      var idToken = response && response[this.config.responseIdTokenProp];

      if (idToken) {
        this.storage.set(this.idTokenName, idToken);
      }

      if (this.config.loginRedirect && !redirect) {
        window.location.href = this.getLoginRedirect();
      } else if (redirect && (0, _authUtilities.isString)(redirect)) {
        window.location.href = window.encodeURI(redirect);
      }
    };

    Authentication.prototype.removeToken = function removeToken() {
      this.storage.remove(this.tokenName);
    };

    Authentication.prototype.isAuthenticated = function isAuthenticated() {
      var token = this.storage.get(this.tokenName);

      if (!token) {
        return false;
      }

      if (token.split('.').length !== 3) {
        return true;
      }

      var exp = void 0;
      try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        exp = JSON.parse(window.atob(base64)).exp;
      } catch (error) {
        return false;
      }

      if (exp) {
        return Math.round(new Date().getTime() / 1000) <= exp;
      }

      return true;
    };

    Authentication.prototype.logout = function logout(redirect) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.storage.remove(_this.tokenName);

        if (_this.config.logoutRedirect && !redirect) {
          window.location.href = _this.config.logoutRedirect;
        } else if ((0, _authUtilities.isString)(redirect)) {
          window.location.href = redirect;
        }

        resolve();
      });
    };

    _createClass(Authentication, [{
      key: 'tokenInterceptor',
      get: function get() {
        var config = this.config;
        var storage = this.storage;
        var auth = this;
        return {
          request: function request(_request) {
            if (auth.isAuthenticated() && config.httpInterceptor) {
              var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
              var token = storage.get(tokenName);

              if (config.authHeader && config.authToken) {
                token = config.authToken + ' ' + token;
              }

              _request.headers.set(config.authHeader, token);
            }
            return _request;
          }
        };
      }
    }]);

    return Authentication;
  }()) || _class);
});
define('aurelia-auth/base-config',['exports', './auth-utilities'], function (exports, _authUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BaseConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BaseConfig = exports.BaseConfig = function () {
    BaseConfig.prototype.configure = function configure(incomingConfig) {
      (0, _authUtilities.merge)(this._current, incomingConfig);
    };

    _createClass(BaseConfig, [{
      key: 'current',
      get: function get() {
        return this._current;
      }
    }]);

    function BaseConfig() {
      _classCallCheck(this, BaseConfig);

      this._current = {
        httpInterceptor: true,
        loginOnSignup: true,
        baseUrl: '/',
        loginRedirect: '#/',
        logoutRedirect: '#/',
        signupRedirect: '#/login',
        loginUrl: '/auth/login',
        signupUrl: '/auth/signup',
        profileUrl: '/auth/me',
        loginRoute: '/login',
        signupRoute: '/signup',
        tokenRoot: false,
        tokenName: 'token',
        idTokenName: 'id_token',
        tokenPrefix: 'aurelia',
        responseTokenProp: 'access_token',
        responseIdTokenProp: 'id_token',
        unlinkUrl: '/auth/unlink/',
        unlinkMethod: 'get',
        authHeader: 'Authorization',
        authToken: 'Bearer',
        withCredentials: true,
        platform: 'browser',
        storage: 'localStorage',
        providers: {
          identSrv: {
            name: 'identSrv',
            url: '/auth/identSrv',

            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'openid'],
            responseType: 'code',
            scopePrefix: '',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope', 'nonce'],
            optionalUrlParams: ['display', 'state'],
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            display: 'popup',
            type: '2.0',
            clientId: 'jsClient',
            nonce: function nonce() {
              var val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
              return encodeURIComponent(val);
            },
            popupOptions: { width: 452, height: 633 }
          },
          google: {
            name: 'google',
            url: '/auth/google',
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['profile', 'email'],
            scopePrefix: 'openid',
            scopeDelimiter: ' ',
            requiredUrlParams: ['scope'],
            optionalUrlParams: ['display', 'state'],
            display: 'popup',
            type: '2.0',
            state: function state() {
              var rand = Math.random().toString(36).substr(2);
              return encodeURIComponent(rand);
            },
            popupOptions: {
              width: 452,
              height: 633
            }
          },
          facebook: {
            name: 'facebook',
            url: '/auth/facebook',
            authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
            redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
            scope: ['email'],
            scopeDelimiter: ',',
            nonce: function nonce() {
              return Math.random();
            },
            requiredUrlParams: ['nonce', 'display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 580,
              height: 400
            }
          },
          linkedin: {
            name: 'linkedin',
            url: '/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimiter: ' ',
            state: 'STATE',
            type: '2.0',
            popupOptions: {
              width: 527,
              height: 582
            }
          },
          github: {
            name: 'github',
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            optionalUrlParams: ['scope'],
            scope: ['user:email'],
            scopeDelimiter: ' ',
            type: '2.0',
            popupOptions: {
              width: 1020,
              height: 618
            }
          },
          yahoo: {
            name: 'yahoo',
            url: '/auth/yahoo',
            authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: [],
            scopeDelimiter: ',',
            type: '2.0',
            popupOptions: {
              width: 559,
              height: 519
            }
          },
          twitter: {
            name: 'twitter',
            url: '/auth/twitter',
            authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
            type: '1.0',
            popupOptions: {
              width: 495,
              height: 645
            }
          },
          live: {
            name: 'live',
            url: '/auth/live',
            authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            scope: ['wl.emails'],
            scopeDelimiter: ' ',
            requiredUrlParams: ['display', 'scope'],
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 500,
              height: 560
            }
          },
          instagram: {
            name: 'instagram',
            url: '/auth/instagram',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            requiredUrlParams: ['scope'],
            scope: ['basic'],
            scopeDelimiter: '+',
            display: 'popup',
            type: '2.0',
            popupOptions: {
              width: 550,
              height: 369
            }
          }
        }
      };
    }

    return BaseConfig;
  }();
});
define('aurelia-auth/auth-utilities',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.status = status;
  exports.isDefined = isDefined;
  exports.camelCase = camelCase;
  exports.parseQueryString = parseQueryString;
  exports.isString = isString;
  exports.isObject = isObject;
  exports.isFunction = isFunction;
  exports.joinUrl = joinUrl;
  exports.isBlankObject = isBlankObject;
  exports.isArrayLike = isArrayLike;
  exports.isWindow = isWindow;
  exports.extend = extend;
  exports.merge = merge;
  exports.forEach = forEach;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var slice = [].slice;

  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  function baseExtend(dst, objs, deep) {
    var h = dst.$$hashKey;

    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj)) continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];

        if (deep && isObject(src)) {
          if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        } else {
          dst[key] = src;
        }
      }
    }

    setHashKey(dst, h);
    return dst;
  }

  function status(response) {
    if (response.status >= 200 && response.status < 400) {
      return response.json().catch(function (error) {
        return null;
      });
    }

    throw response;
  }

  function isDefined(value) {
    return typeof value !== 'undefined';
  }

  function camelCase(name) {
    return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  function parseQueryString(keyValue) {
    var key = void 0;
    var value = void 0;
    var obj = {};

    forEach((keyValue || '').split('&'), function (kv) {
      if (kv) {
        value = kv.split('=');
        key = decodeURIComponent(value[0]);
        obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
      }
    });

    return obj;
  }

  function isString(value) {
    return typeof value === 'string';
  }

  function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function joinUrl(baseUrl, url) {
    if (/^(?:[a-z]+:)?\/\//i.test(url)) {
      return url;
    }

    var joined = [baseUrl, url].join('/');
    var normalize = function normalize(str) {
      return str.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
    };

    return normalize(joined);
  }

  function isBlankObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Object.getPrototypeOf(value);
  }

  function isArrayLike(obj) {
    if (obj === null || isWindow(obj)) {
      return false;
    }
  }

  function isWindow(obj) {
    return obj && obj.window === obj;
  }

  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }

  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }

  function forEach(obj, iterator, context) {
    var key = void 0;
    var length = void 0;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key !== 'prototype' && key !== 'length' && key !== 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (Array.isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }
});
define('aurelia-auth/storage',['exports', 'aurelia-dependency-injection', './base-config'], function (exports, _aureliaDependencyInjection, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Storage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Storage = exports.Storage = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Storage(config) {
      _classCallCheck(this, Storage);

      this.config = config.current;
      this.storage = this._getStorage(this.config.storage);
    }

    Storage.prototype.get = function get(key) {
      return this.storage.getItem(key);
    };

    Storage.prototype.set = function set(key, value) {
      return this.storage.setItem(key, value);
    };

    Storage.prototype.remove = function remove(key) {
      return this.storage.removeItem(key);
    };

    Storage.prototype._getStorage = function _getStorage(type) {
      if (type === 'localStorage') {
        if ('localStorage' in window && window.localStorage !== null) return localStorage;
        throw new Error('Local Storage is disabled or unavailable.');
      } else if (type === 'sessionStorage') {
        if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
        throw new Error('Session Storage is disabled or unavailable.');
      }

      throw new Error('Invalid storage type specified: ' + type);
    };

    return Storage;
  }()) || _class);
});
define('aurelia-auth/oAuth1',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth1 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth1 = exports.OAuth1 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig), _dec(_class = function () {
    function OAuth1(storage, popup, http, config) {
      _classCallCheck(this, OAuth1);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.defaults = {
        url: null,
        name: null,
        popupOptions: null,
        redirectUri: null,
        authorizationEndpoint: null
      };
    }

    OAuth1.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);
      var serverUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;

      if (this.config.platform !== 'mobile') {
        this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
      }
      return this.http.fetch(serverUrl, {
        method: 'post'
      }).then(_authUtilities.status).then(function (response) {
        if (_this.config.platform === 'mobile') {
          _this.popup = _this.popup.open([current.authorizationEndpoint, _this.buildQueryString(response)].join('?'), current.name, current.popupOptions, current.redirectUri);
        } else {
          _this.popup.popupWindow.location = [current.authorizationEndpoint, _this.buildQueryString(response)].join('?');
        }

        var popupListener = _this.config.platform === 'mobile' ? _this.popup.eventListener(current.redirectUri) : _this.popup.pollPopup();
        return popupListener.then(function (result) {
          return _this.exchangeForToken(result, userData, current);
        });
      });
    };

    OAuth1.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, oauthData);
      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth1.prototype.buildQueryString = function buildQueryString(obj) {
      var str = [];
      (0, _authUtilities.forEach)(obj, function (value, key) {
        return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });
      return str.join('&');
    };

    return OAuth1;
  }()) || _class);
});
define('aurelia-auth/popup',['exports', './auth-utilities', './base-config', 'aurelia-dependency-injection'], function (exports, _authUtilities, _baseConfig, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Popup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Popup = exports.Popup = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Popup(config) {
      _classCallCheck(this, Popup);

      this.config = config.current;
      this.popupWindow = null;
      this.polling = null;
      this.url = '';
    }

    Popup.prototype.open = function open(url, windowName, options, redirectUri) {
      this.url = url;
      var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
      this.popupWindow = window.open(url, windowName, optionsString);
      if (this.popupWindow && this.popupWindow.focus) {
        this.popupWindow.focus();
      }

      return this;
    };

    Popup.prototype.eventListener = function eventListener(redirectUri) {
      var self = this;
      var promise = new Promise(function (resolve, reject) {
        self.popupWindow.addEventListener('loadstart', function (event) {
          if (event.url.indexOf(redirectUri) !== 0) {
            return;
          }

          var parser = document.createElement('a');
          parser.href = event.url;

          if (parser.search || parser.hash) {
            var queryParams = parser.search.substring(1).replace(/\/$/, '');
            var hashParams = parser.hash.substring(1).replace(/\/$/, '');
            var hash = (0, _authUtilities.parseQueryString)(hashParams);
            var qs = (0, _authUtilities.parseQueryString)(queryParams);

            (0, _authUtilities.extend)(qs, hash);

            if (qs.error) {
              reject({
                error: qs.error
              });
            } else {
              resolve(qs);
            }

            self.popupWindow.close();
          }
        });

        popupWindow.addEventListener('exit', function () {
          reject({
            data: 'Provider Popup was closed'
          });
        });

        popupWindow.addEventListener('loaderror', function () {
          deferred.reject({
            data: 'Authorization Failed'
          });
        });
      });
      return promise;
    };

    Popup.prototype.pollPopup = function pollPopup() {
      var _this = this;

      var self = this;
      var promise = new Promise(function (resolve, reject) {
        _this.polling = setInterval(function () {
          try {
            var documentOrigin = document.location.host;
            var popupWindowOrigin = self.popupWindow.location.host;

            if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
              var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
              var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
              var hash = (0, _authUtilities.parseQueryString)(hashParams);
              var qs = (0, _authUtilities.parseQueryString)(queryParams);

              (0, _authUtilities.extend)(qs, hash);

              if (qs.error) {
                reject({
                  error: qs.error
                });
              } else {
                resolve(qs);
              }

              self.popupWindow.close();
              clearInterval(self.polling);
            }
          } catch (error) {}

          if (!self.popupWindow) {
            clearInterval(self.polling);
            reject({
              data: 'Provider Popup Blocked'
            });
          } else if (self.popupWindow.closed) {
            clearInterval(self.polling);
            reject({
              data: 'Problem poll popup'
            });
          }
        }, 35);
      });
      return promise;
    };

    Popup.prototype.prepareOptions = function prepareOptions(options) {
      var width = options.width || 500;
      var height = options.height || 500;
      return (0, _authUtilities.extend)({
        width: width,
        height: height,
        left: window.screenX + (window.outerWidth - width) / 2,
        top: window.screenY + (window.outerHeight - height) / 2.5
      }, options);
    };

    Popup.prototype.stringifyOptions = function stringifyOptions(options) {
      var parts = [];
      (0, _authUtilities.forEach)(options, function (value, key) {
        parts.push(key + '=' + value);
      });
      return parts.join(',');
    };

    return Popup;
  }()) || _class);
});
define('aurelia-auth/oAuth2',['exports', 'aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', './authentication', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtilities, _storage, _popup, _baseConfig, _authentication, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OAuth2 = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var OAuth2 = exports.OAuth2 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig, _authentication.Authentication), _dec(_class = function () {
    function OAuth2(storage, popup, http, config, auth) {
      _classCallCheck(this, OAuth2);

      this.storage = storage;
      this.config = config.current;
      this.popup = popup;
      this.http = http;
      this.auth = auth;
      this.defaults = {
        url: null,
        name: null,
        state: null,
        scope: null,
        scopeDelimiter: null,
        redirectUri: null,
        popupOptions: null,
        authorizationEndpoint: null,
        responseParams: null,
        requiredUrlParams: null,
        optionalUrlParams: null,
        defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
        responseType: 'code'
      };
    }

    OAuth2.prototype.open = function open(options, userData) {
      var _this = this;

      var current = (0, _authUtilities.extend)({}, this.defaults, options);

      var stateName = current.name + '_state';

      if ((0, _authUtilities.isFunction)(current.state)) {
        this.storage.set(stateName, current.state());
      } else if ((0, _authUtilities.isString)(current.state)) {
        this.storage.set(stateName, current.state);
      }

      var nonceName = current.name + '_nonce';

      if ((0, _authUtilities.isFunction)(current.nonce)) {
        this.storage.set(nonceName, current.nonce());
      } else if ((0, _authUtilities.isString)(current.nonce)) {
        this.storage.set(nonceName, current.nonce);
      }

      var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

      var openPopup = void 0;
      if (this.config.platform === 'mobile') {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
      } else {
        openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
      }

      return openPopup.then(function (oauthData) {
        if (oauthData.state && oauthData.state !== _this.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }

        if (current.responseType.toUpperCase().indexOf('TOKEN') !== -1) {
          if (!_this.verifyIdToken(oauthData, current.name)) {
            return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
          }

          return oauthData;
        }

        return _this.exchangeForToken(oauthData, userData, current);
      });
    };

    OAuth2.prototype.verifyIdToken = function verifyIdToken(oauthData, providerName) {
      var idToken = oauthData && oauthData[this.config.responseIdTokenProp];
      if (!idToken) return true;
      var idTokenObject = this.auth.decomposeToken(idToken);
      if (!idTokenObject) return true;
      var nonceFromToken = idTokenObject.nonce;
      if (!nonceFromToken) return true;
      var nonceInStorage = this.storage.get(providerName + '_nonce');
      if (nonceFromToken !== nonceInStorage) {
        return false;
      }
      return true;
    };

    OAuth2.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
      var data = (0, _authUtilities.extend)({}, userData, {
        code: oauthData.code,
        clientId: current.clientId,
        redirectUri: current.redirectUri
      });

      if (oauthData.state) {
        data.state = oauthData.state;
      }

      (0, _authUtilities.forEach)(current.responseParams, function (param) {
        return data[param] = oauthData[param];
      });

      var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
      var credentials = this.config.withCredentials ? 'include' : 'same-origin';

      return this.http.fetch(exchangeForTokenUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(data),
        credentials: credentials
      }).then(_authUtilities.status);
    };

    OAuth2.prototype.buildQueryString = function buildQueryString(current) {
      var _this2 = this;

      var keyValuePairs = [];
      var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

      (0, _authUtilities.forEach)(urlParams, function (params) {
        (0, _authUtilities.forEach)(current[params], function (paramName) {
          var camelizedName = (0, _authUtilities.camelCase)(paramName);
          var paramValue = (0, _authUtilities.isFunction)(current[paramName]) ? current[paramName]() : current[camelizedName];

          if (paramName === 'state') {
            var stateName = current.name + '_state';
            paramValue = encodeURIComponent(_this2.storage.get(stateName));
          }

          if (paramName === 'nonce') {
            var nonceName = current.name + '_nonce';
            paramValue = encodeURIComponent(_this2.storage.get(nonceName));
          }

          if (paramName === 'scope' && Array.isArray(paramValue)) {
            paramValue = paramValue.join(current.scopeDelimiter);

            if (current.scopePrefix) {
              paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
            }
          }

          keyValuePairs.push([paramName, paramValue]);
        });
      });

      return keyValuePairs.map(function (pair) {
        return pair.join('=');
      }).join('&');
    };

    return OAuth2;
  }()) || _class);
});
define('aurelia-auth/authorize-step',['exports', 'aurelia-dependency-injection', 'aurelia-router', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaRouter, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthorizeStep = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AuthorizeStep = exports.AuthorizeStep = (_dec = (0, _aureliaDependencyInjection.inject)(_authentication.Authentication), _dec(_class = function () {
    function AuthorizeStep(auth) {
      _classCallCheck(this, AuthorizeStep);

      this.auth = auth;
    }

    AuthorizeStep.prototype.run = function run(routingContext, next) {
      var isLoggedIn = this.auth.isAuthenticated();
      var loginRoute = this.auth.getLoginRoute();

      if (routingContext.getAllInstructions().some(function (i) {
        return i.config.auth;
      })) {
        if (!isLoggedIn) {
          this.auth.setInitialUrl(window.location.href);
          return next.cancel(new _aureliaRouter.Redirect(loginRoute));
        }
      } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
        return i.fragment === loginRoute;
      })) {
        var loginRedirect = this.auth.getLoginRedirect();
        return next.cancel(new _aureliaRouter.Redirect(loginRedirect));
      }

      return next();
    };

    return AuthorizeStep;
  }()) || _class);
});
define('aurelia-auth/auth-fetch-config',['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _authentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FetchConfig = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var FetchConfig = exports.FetchConfig = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication), _dec(_class = function () {
    function FetchConfig(httpClient, authService) {
      _classCallCheck(this, FetchConfig);

      this.httpClient = httpClient;
      this.auth = authService;
    }

    FetchConfig.prototype.configure = function configure() {
      var _this = this;

      this.httpClient.configure(function (httpConfig) {
        httpConfig.withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).withInterceptor(_this.auth.tokenInterceptor);
      });
    };

    return FetchConfig;
  }()) || _class);
});
define('aurelia-auth/auth-filter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
    function AuthFilterValueConverter() {
      _classCallCheck(this, AuthFilterValueConverter);
    }

    AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
      return routes.filter(function (r) {
        return r.config.auth === undefined || r.config.auth === isAuthenticated;
      });
    };

    return AuthFilterValueConverter;
  }();
});
define('aurelia-dialog/ai-dialog',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialog = undefined;

  

  var _dec, _dec2, _class;

  var AiDialog = exports.AiDialog = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-header',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogHeader = undefined;

  

  var _dec, _dec2, _class, _class2, _temp;

  var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
    

    this.controller = controller;
  }, _class2.inject = [_dialogController.DialogController], _temp)) || _class) || _class);
});
define('aurelia-dialog/dialog-controller',['exports', './lifecycle', './dialog-result'], function (exports, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogController = undefined;

  

  var DialogController = exports.DialogController = function () {
    function DialogController(renderer, settings, resolve, reject) {
      

      this.renderer = renderer;
      this.settings = settings;
      this._resolve = resolve;
      this._reject = reject;
    }

    DialogController.prototype.ok = function ok(output) {
      return this.close(true, output);
    };

    DialogController.prototype.cancel = function cancel(output) {
      return this.close(false, output);
    };

    DialogController.prototype.error = function error(message) {
      var _this = this;

      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
        return _this.renderer.hideDialog(_this);
      }).then(function () {
        _this.controller.unbind();
        _this._reject(message);
      });
    };

    DialogController.prototype.close = function close(ok, output) {
      var _this2 = this;

      if (this._closePromise) {
        return this._closePromise;
      }

      this._closePromise = (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
        if (canDeactivate) {
          return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
            return _this2.renderer.hideDialog(_this2);
          }).then(function () {
            var result = new _dialogResult.DialogResult(!ok, output);
            _this2.controller.unbind();
            _this2._resolve(result);
            return result;
          });
        }

        _this2._closePromise = undefined;
      }, function (e) {
        _this2._closePromise = undefined;
        return Promise.reject(e);
      });

      return this._closePromise;
    };

    return DialogController;
  }();
});
define('aurelia-dialog/lifecycle',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invokeLifecycle = invokeLifecycle;
  function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
      var result = instance[name](model);

      if (result instanceof Promise) {
        return result;
      }

      if (result !== null && result !== undefined) {
        return Promise.resolve(result);
      }

      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }
});
define('aurelia-dialog/dialog-result',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
    

    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = output;
  };
});
define('aurelia-dialog/ai-dialog-body',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogBody = undefined;

  

  var _dec, _dec2, _class;

  var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-footer',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogFooter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

  var AiDialogFooter = exports.AiDialogFooter = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function AiDialogFooter(controller) {
      

      _initDefineProp(this, 'buttons', _descriptor, this);

      _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

      this.controller = controller;
    }

    AiDialogFooter.prototype.close = function close(buttonValue) {
      if (AiDialogFooter.isCancelButton(buttonValue)) {
        this.controller.cancel(buttonValue);
      } else {
        this.controller.ok(buttonValue);
      }
    };

    AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
      if (newValue) {
        this.buttons = ['Cancel', 'Ok'];
      }
    };

    AiDialogFooter.isCancelButton = function isCancelButton(value) {
      return value === 'Cancel';
    };

    return AiDialogFooter;
  }(), _class3.inject = [_dialogController.DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-dialog/attach-focus',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttachFocus = undefined;

  

  var _dec, _class, _class2, _temp;

  var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
    function AttachFocus(element) {
      

      this.value = true;

      this.element = element;
    }

    AttachFocus.prototype.attached = function attached() {
      if (this.value && this.value !== 'false') {
        this.element.focus();
      }
    };

    AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
      this.value = newValue;
    };

    return AttachFocus;
  }(), _class2.inject = [Element], _temp)) || _class);
});
define('aurelia-dialog/dialog-configuration',['exports', './renderer', './dialog-renderer', './dialog-options', 'aurelia-pal'], function (exports, _renderer, _dialogRenderer, _dialogOptions, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogConfiguration = undefined;

  

  var defaultRenderer = _dialogRenderer.DialogRenderer;

  var resources = {
    'ai-dialog': './ai-dialog',
    'ai-dialog-header': './ai-dialog-header',
    'ai-dialog-body': './ai-dialog-body',
    'ai-dialog-footer': './ai-dialog-footer',
    'attach-focus': './attach-focus'
  };

  var defaultCSSText = 'ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}';

  var DialogConfiguration = exports.DialogConfiguration = function () {
    function DialogConfiguration(aurelia) {
      

      this.aurelia = aurelia;
      this.settings = _dialogOptions.dialogOptions;
      this.resources = [];
      this.cssText = defaultCSSText;
      this.renderer = defaultRenderer;
    }

    DialogConfiguration.prototype.useDefaults = function useDefaults() {
      return this.useRenderer(defaultRenderer).useCSS(defaultCSSText).useStandardResources();
    };

    DialogConfiguration.prototype.useStandardResources = function useStandardResources() {
      return this.useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
    };

    DialogConfiguration.prototype.useResource = function useResource(resourceName) {
      this.resources.push(resourceName);
      return this;
    };

    DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
      this.renderer = renderer;
      this.settings = Object.assign(this.settings, settings || {});
      return this;
    };

    DialogConfiguration.prototype.useCSS = function useCSS(cssText) {
      this.cssText = cssText;
      return this;
    };

    DialogConfiguration.prototype._apply = function _apply() {
      var _this = this;

      this.aurelia.transient(_renderer.Renderer, this.renderer);
      this.resources.forEach(function (resourceName) {
        return _this.aurelia.globalResources(resources[resourceName]);
      });

      if (this.cssText) {
        _aureliaPal.DOM.injectStyles(this.cssText);
      }
    };

    return DialogConfiguration;
  }();
});
define('aurelia-dialog/renderer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var Renderer = exports.Renderer = function () {
    function Renderer() {
      
    }

    Renderer.prototype.getDialogContainer = function getDialogContainer() {
      throw new Error('DialogRenderer must implement getDialogContainer().');
    };

    Renderer.prototype.showDialog = function showDialog(dialogController) {
      throw new Error('DialogRenderer must implement showDialog().');
    };

    Renderer.prototype.hideDialog = function hideDialog(dialogController) {
      throw new Error('DialogRenderer must implement hideDialog().');
    };

    return Renderer;
  }();
});
define('aurelia-dialog/dialog-renderer',['exports', 'aurelia-pal', 'aurelia-dependency-injection'], function (exports, _aureliaPal, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogRenderer = undefined;

  

  var _dec, _class;

  var containerTagName = 'ai-dialog-container';
  var overlayTagName = 'ai-dialog-overlay';
  var transitionEvent = function () {
    var transition = null;

    return function () {
      if (transition) return transition;

      var t = void 0;
      var el = _aureliaPal.DOM.createElement('fakeelement');
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          transition = transitions[t];
          return transition;
        }
      }
    };
  }();

  var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
    function DialogRenderer() {
      var _this = this;

      

      this._escapeKeyEventHandler = function (e) {
        if (e.keyCode === 27) {
          var top = _this._dialogControllers[_this._dialogControllers.length - 1];
          if (top && top.settings.lock !== true) {
            top.cancel();
          }
        }
      };
    }

    DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
      return _aureliaPal.DOM.createElement('div');
    };

    DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
      var _this2 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];
      var wrapper = document.createElement('div');

      this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
      this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
      this.anchor = dialogController.slot.anchor;
      wrapper.appendChild(this.anchor);
      this.modalContainer.appendChild(wrapper);

      this.stopPropagation = function (e) {
        e._aureliaDialogHostClicked = true;
      };
      this.closeModalClick = function (e) {
        if (!settings.lock && !e._aureliaDialogHostClicked) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      dialogController.centerDialog = function () {
        if (settings.centerHorizontalOnly) return;
        centerDialog(_this2.modalContainer);
      };

      this.modalOverlay.style.zIndex = settings.startingZIndex;
      this.modalContainer.style.zIndex = settings.startingZIndex;

      var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

      if (lastContainer) {
        lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
        lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
      } else {
        body.insertBefore(this.modalContainer, body.firstChild);
        body.insertBefore(this.modalOverlay, body.firstChild);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.addEventListener('keyup', this._escapeKeyEventHandler);
      }

      this._dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(this.modalContainer, this.modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      this.modalContainer.addEventListener('click', this.closeModalClick);
      this.anchor.addEventListener('click', this.stopPropagation);

      return new Promise(function (resolve) {
        var renderer = _this2;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this2.modalOverlay.classList.add('active');
        _this2.modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');

        function onTransitionEnd(e) {
          if (e.target !== renderer.modalContainer) {
            return;
          }
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      });
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
      var _this3 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];

      this.modalContainer.removeEventListener('click', this.closeModalClick);
      this.anchor.removeEventListener('click', this.stopPropagation);

      var i = this._dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this._dialogControllers.splice(i, 1);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.removeEventListener('keyup', this._escapeKeyEventHandler);
      }

      return new Promise(function (resolve) {
        var renderer = _this3;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this3.modalOverlay.classList.remove('active');
        _this3.modalContainer.classList.remove('active');

        function onTransitionEnd() {
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      }).then(function () {
        body.removeChild(_this3.modalOverlay);
        body.removeChild(_this3.modalContainer);
        dialogController.slot.detached();

        if (!_this3._dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }

        return Promise.resolve();
      });
    };

    return DialogRenderer;
  }()) || _class);


  DialogRenderer.prototype._dialogControllers = [];

  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }
});
define('aurelia-dialog/dialog-options',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dialogOptions = exports.dialogOptions = {
    lock: true,
    centerHorizontalOnly: false,
    startingZIndex: 1000,
    ignoreTransitions: false
  };
});
define('aurelia-dialog/dialog-service',['exports', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result', './dialog-options'], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _aureliaTemplating, _dialogController, _renderer, _lifecycle, _dialogResult, _dialogOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogService = undefined;

  

  var _class, _temp;

  var DialogService = exports.DialogService = (_temp = _class = function () {
    function DialogService(container, compositionEngine) {
      

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.controllers = [];
      this.hasActiveDialog = false;
    }

    DialogService.prototype.open = function open(settings) {
      return this.openAndYieldController(settings).then(function (controller) {
        return controller.result;
      });
    };

    DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
      var _this = this;

      var childContainer = this.container.createChild();
      var dialogController = void 0;
      var promise = new Promise(function (resolve, reject) {
        dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), _createSettings(settings), resolve, reject);
      });
      childContainer.registerInstance(_dialogController.DialogController, dialogController);
      dialogController.result = promise;
      dialogController.result.then(function () {
        _removeController(_this, dialogController);
      }, function () {
        _removeController(_this, dialogController);
      });
      return _openDialog(this, childContainer, dialogController).then(function () {
        return dialogController;
      });
    };

    return DialogService;
  }(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


  function _createSettings(settings) {
    settings = Object.assign({}, _dialogOptions.dialogOptions, settings);
    settings.startingZIndex = _dialogOptions.dialogOptions.startingZIndex;
    return settings;
  }

  function _openDialog(service, childContainer, dialogController) {
    var host = dialogController.renderer.getDialogContainer();
    var instruction = {
      container: service.container,
      childContainer: childContainer,
      model: dialogController.settings.model,
      view: dialogController.settings.view,
      viewModel: dialogController.settings.viewModel,
      viewSlot: new _aureliaTemplating.ViewSlot(host, true),
      host: host
    };

    return _getViewModel(instruction, service.compositionEngine).then(function (returnedInstruction) {
      dialogController.viewModel = returnedInstruction.viewModel;
      dialogController.slot = returnedInstruction.viewSlot;

      return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
        if (canActivate) {
          return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
            service.controllers.push(dialogController);
            service.hasActiveDialog = !!service.controllers.length;
            dialogController.controller = controller;
            dialogController.view = controller.view;

            return dialogController.renderer.showDialog(dialogController);
          });
        }
      });
    });
  }

  function _getViewModel(instruction, compositionEngine) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }

  function _removeController(service, controller) {
    var i = service.controllers.indexOf(controller);
    if (i !== -1) {
      service.controllers.splice(i, 1);
      service.hasActiveDialog = !!service.controllers.length;
    }
  }
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"resources/elements/navbar/navbar\"></require>\n  <require from=\"./app.css\"></require>\n\n  <div class=\"navbar\">\n    <navbar router.bind=\"router\"></navbar>\n  </div>\n\n  <div class=\"page-host\">\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!views/login/index.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!views/login/login.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./login.css\"></require>\n\n  <form class=\"login\" submit.delegate=\"login()\">\n    <label for=\"email\">Email</label>\n    <input type=\"email\" class=\"email\" name=\"email\" value.bind=\"email\">\n    <label for=\"password\">Password</label>\n    <input type=\"password\" name=\"password\" value.bind=\"password\">\n    <button type=\"submit\">Login</button>\n  </form>\n  <div>\n    Don't have an account? <a route-href=\"route: signup\">Signup</a>!\n  </div>\n  <div>\n    <a route-href=\"route: reset\">Forgot password?</a>\n  </div>\n</template>\n"; });
define('text!views/login/reset.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./reset.css\"></require>\n\n  <label for=\"email\">Email</label>\n  <input type=\"email\" class=\"email\" name=\"email\" value=\"\">\n  <button type=\"submit\">Send Reset Link</button>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "html {\n  box-sizing: border-box; }\n\n*, *::after, *::before {\n  box-sizing: inherit; }\n\nbutton, [type='button'], [type='reset'], [type='submit'] {\n  appearance: none;\n  background-color: #1565c0;\n  border: 0;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  -webkit-font-smoothing: antialiased;\n  font-weight: 600;\n  line-height: 1;\n  padding: 0.75em 1.5em;\n  text-align: center;\n  text-decoration: none;\n  transition: background-color 150ms ease;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  button:hover, button:focus, [type='button']:hover, [type='button']:focus, [type='reset']:hover, [type='reset']:focus, [type='submit']:hover, [type='submit']:focus {\n    background-color: #11519a;\n    color: #fff; }\n  button:disabled, [type='button']:disabled, [type='reset']:disabled, [type='submit']:disabled {\n    cursor: not-allowed;\n    opacity: 0.5; }\n    button:disabled:hover, [type='button']:disabled:hover, [type='reset']:disabled:hover, [type='submit']:disabled:hover {\n      background-color: #1565c0; }\n\nfieldset {\n  background-color: transparent;\n  border: 0;\n  margin: 0;\n  padding: 0; }\n\nlegend {\n  font-weight: 600;\n  margin-bottom: 0.375em;\n  padding: 0; }\n\nlabel {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.375em; }\n\ninput,\nselect,\ntextarea {\n  display: block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em; }\n\n[type='color'], [type='date'], [type='datetime'], [type='datetime-local'], [type='email'], [type='month'], [type='number'], [type='password'], [type='search'], [type='tel'], [type='text'], [type='time'], [type='url'], [type='week'], input:not([type]), textarea {\n  appearance: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 3px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);\n  box-sizing: border-box;\n  margin-bottom: 0.75em;\n  padding: 0.5em;\n  transition: border-color 150ms ease;\n  width: 100%; }\n  [type='color']:hover, [type='date']:hover, [type='datetime']:hover, [type='datetime-local']:hover, [type='email']:hover, [type='month']:hover, [type='number']:hover, [type='password']:hover, [type='search']:hover, [type='tel']:hover, [type='text']:hover, [type='time']:hover, [type='url']:hover, [type='week']:hover, input:not([type]):hover, textarea:hover {\n    border-color: #b1b1b1; }\n  [type='color']:focus, [type='date']:focus, [type='datetime']:focus, [type='datetime-local']:focus, [type='email']:focus, [type='month']:focus, [type='number']:focus, [type='password']:focus, [type='search']:focus, [type='tel']:focus, [type='text']:focus, [type='time']:focus, [type='url']:focus, [type='week']:focus, input:not([type]):focus, textarea:focus {\n    border-color: #1565c0;\n    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 5px rgba(18, 89, 169, 0.7);\n    outline: none; }\n  [type='color']:disabled, [type='date']:disabled, [type='datetime']:disabled, [type='datetime-local']:disabled, [type='email']:disabled, [type='month']:disabled, [type='number']:disabled, [type='password']:disabled, [type='search']:disabled, [type='tel']:disabled, [type='text']:disabled, [type='time']:disabled, [type='url']:disabled, [type='week']:disabled, input:not([type]):disabled, textarea:disabled {\n    background-color: #f2f2f2;\n    cursor: not-allowed; }\n    [type='color']:disabled:hover, [type='date']:disabled:hover, [type='datetime']:disabled:hover, [type='datetime-local']:disabled:hover, [type='email']:disabled:hover, [type='month']:disabled:hover, [type='number']:disabled:hover, [type='password']:disabled:hover, [type='search']:disabled:hover, [type='tel']:disabled:hover, [type='text']:disabled:hover, [type='time']:disabled:hover, [type='url']:disabled:hover, [type='week']:disabled:hover, input:not([type]):disabled:hover, textarea:disabled:hover {\n      border: 1px solid #ddd; }\n  [type='color']::placeholder, [type='date']::placeholder, [type='datetime']::placeholder, [type='datetime-local']::placeholder, [type='email']::placeholder, [type='month']::placeholder, [type='number']::placeholder, [type='password']::placeholder, [type='search']::placeholder, [type='tel']::placeholder, [type='text']::placeholder, [type='time']::placeholder, [type='url']::placeholder, [type='week']::placeholder, input:not([type])::placeholder, textarea::placeholder {\n    color: #858585; }\n\ntextarea {\n  resize: vertical; }\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  display: inline;\n  margin-right: 0.375em; }\n\n[type=\"file\"] {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nselect {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nhtml {\n  box-sizing: border-box; }\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\nhtml,\nbody {\n  height: 100%; }\n\nul,\nol {\n  list-style-type: none;\n  margin: 0;\n  padding: 0; }\n\ndl {\n  margin: 0; }\n\ndt {\n  font-weight: 600;\n  margin: 0; }\n\ndd {\n  margin: 0; }\n\nfigure {\n  margin: 0; }\n\nimg,\npicture {\n  margin: 0;\n  max-width: 100%; }\n\ntable {\n  border-collapse: collapse;\n  margin: 0.75em 0;\n  table-layout: fixed;\n  width: 100%; }\n\nth {\n  border-bottom: 1px solid #a6a6a6;\n  font-weight: 600;\n  padding: 0.75em 0;\n  text-align: left; }\n\ntd {\n  border-bottom: 1px solid #ddd;\n  padding: 0.75em 0; }\n\ntr,\ntd,\nth {\n  vertical-align: middle; }\n\nbody {\n  color: #333;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  line-height: 1.5; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1.25em;\n  line-height: 1.2;\n  margin: 0 0 0.75em; }\n\np {\n  margin: 0 0 0.75em; }\n\na {\n  color: #1565c0;\n  text-decoration: none;\n  transition: color 150ms ease; }\n  a:active, a:focus, a:hover {\n    color: #104c90; }\n\nhr {\n  border-bottom: 1px solid #ddd;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  margin: 1.5em 0; }\n\n@media screen and (min-width: 900px) {\n  body {\n    margin-left: 10%;\n    margin-right: 10%; } }\n"; });
define('text!views/login/signup.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./signup.css\"></require>\n\n  <label for=\"email\">Email</label>\n  <input type=\"email\" class=\"email\" name=\"email\" value=\"\">\n  <label for=\"password\">Password</label>\n  <input type=\"password\" name=\"password\" value=\"\">\n  <label for=\"repeat\">Repeat Password</label>\n  <input type=\"password\" name=\"repeat\" value=\"\">\n  <button type=\"submit\">Signup</button>\n</template>\n"; });
define('text!views/requests/index.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!views/requests/requests.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./requests.css\"></require>\n  <require from=\"./components/request-card/request-card\"></require>\n  <require from=\"./components/search/search\"></require>\n  <require from=\"./components/countries/countries\"></require>\n\n  <div class=\"search-bar\">\n    <search model=\"requests.params.where\" onChange=\"getrequests\"></search>\n  </div>\n  <div class=\"search-filters\">\n    <countries store.bind=\"requests\" values.bind=\"countries.data\" change.call=\"getRequests(params)\">\n    </countries>\n    <!-- <sort model=\"requests.params.sort\" values=\"requests.sort\" onChange=\"getrequests\"></sort> -->\n  </div>\n  <div class=\"request-list\">\n    <div class=\"cards\">\n      <request-card repeat.for=\"request of requests.data\" class=\"request-card\" request.bind=\"request\"></request-card>\n    </div>\n  </div>\n  <pagination page=\"requestCollection.page.number\" total=\"requestCollection.total\"></pagination>\n</template>\n"; });
define('text!views/user/index.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!resources/elements/filter/filter.html', ['module'], function(module) { module.exports = "<template>\n  <label>\n    ${label}\n    <select change.trigger=\"onChange()\">\n      <option repeat.for=\"value of values\" selected.bind=\"value.id\">${value.name}</option>\n    </select>\n  </label>\n</template>\n"; });
define('text!resources/elements/navbar/navbar.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./navbar.css\"></require>\n  <header role=\"banner\">\n    <nav class=\"nav-container\" role=\"navigation\">\n      <div class=\"logo\">\n        Radship\n      </div>\n\n      <ul class=\"tab inline-flex main-nav\">\n        <li class=\"tab-item ${row.isActive ? 'active': ''} \" repeat.for=\"row of router.navigation | authFilter: auth.isAuthenticated()\">\n          <a href.bind=\"row.href\">${row.title}</a>\n        </li>\n      </ul>\n\n      <div if.bind=\"userStore.user\" class=\"signup\">\n        <a href=\"#\" route-href=\"route: user\">${userStore.user.name}</a>\n        <a href=\"#\" click.delegate=\"logout()\">Logout</a>\n      </div>\n      <div if.bind=\"!userStore.user\" class=\"signup\">\n        <a href=\"#\" route-href=\"route: user\">${userStore.user.name}</a>\n        <a route-href=\"route: auth\">Login/Register</a>\n      </div>\n    </nav>\n  </header>\n</template>\n"; });
define('text!resources/elements/signin/signin.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./signin.css\"></require>\n  <ai-dialog class=\"modal-sm active\">\n    <div class=\"modal-container\">\n      <ai-dialog-body class=\"modal-body\">\n        <div class=\"content\">\n          <div class=\"form-group\">\n            <label class=\"form-label\" for=\"email\">Email</label>\n            <input attach-focus=\"true\" class=\"form-input\" type=\"email\" value.bind=\"person.email\" placeholder=\"email\">\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" for=\"password\">Password</label>\n            <input class=\"form-input\" type=\"password\" value.bind=\"person.password\" placeholder=\"password\">\n          </div>\n        </div>\n      </ai-dialog-body>\n      <ai-dialog-footer class=\"modal-footer\">\n        <button class=\"btn btn-link\" click.delegate=\"controller.cancel()\">Cancel</button>\n        <button class=\"btn btn-primary\" click.delegate=\"login(user)\">Sign In</button>\n      </ai-dialog-footer>\n    </div>\n  </ai-dialog>\n</template>\n"; });
define('text!views/login/login.css', ['module'], function(module) { module.exports = "html {\n  box-sizing: border-box; }\n\n*, *::after, *::before {\n  box-sizing: inherit; }\n\nbutton, [type='button'], [type='reset'], [type='submit'] {\n  appearance: none;\n  background-color: #1565c0;\n  border: 0;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  -webkit-font-smoothing: antialiased;\n  font-weight: 600;\n  line-height: 1;\n  padding: 0.75em 1.5em;\n  text-align: center;\n  text-decoration: none;\n  transition: background-color 150ms ease;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  button:hover, button:focus, [type='button']:hover, [type='button']:focus, [type='reset']:hover, [type='reset']:focus, [type='submit']:hover, [type='submit']:focus {\n    background-color: #11519a;\n    color: #fff; }\n  button:disabled, [type='button']:disabled, [type='reset']:disabled, [type='submit']:disabled {\n    cursor: not-allowed;\n    opacity: 0.5; }\n    button:disabled:hover, [type='button']:disabled:hover, [type='reset']:disabled:hover, [type='submit']:disabled:hover {\n      background-color: #1565c0; }\n\nfieldset {\n  background-color: transparent;\n  border: 0;\n  margin: 0;\n  padding: 0; }\n\nlegend {\n  font-weight: 600;\n  margin-bottom: 0.375em;\n  padding: 0; }\n\nlabel {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.375em; }\n\ninput,\nselect,\ntextarea {\n  display: block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em; }\n\n[type='color'], [type='date'], [type='datetime'], [type='datetime-local'], [type='email'], [type='month'], [type='number'], [type='password'], [type='search'], [type='tel'], [type='text'], [type='time'], [type='url'], [type='week'], input:not([type]), textarea {\n  appearance: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 3px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);\n  box-sizing: border-box;\n  margin-bottom: 0.75em;\n  padding: 0.5em;\n  transition: border-color 150ms ease;\n  width: 100%; }\n  [type='color']:hover, [type='date']:hover, [type='datetime']:hover, [type='datetime-local']:hover, [type='email']:hover, [type='month']:hover, [type='number']:hover, [type='password']:hover, [type='search']:hover, [type='tel']:hover, [type='text']:hover, [type='time']:hover, [type='url']:hover, [type='week']:hover, input:not([type]):hover, textarea:hover {\n    border-color: #b1b1b1; }\n  [type='color']:focus, [type='date']:focus, [type='datetime']:focus, [type='datetime-local']:focus, [type='email']:focus, [type='month']:focus, [type='number']:focus, [type='password']:focus, [type='search']:focus, [type='tel']:focus, [type='text']:focus, [type='time']:focus, [type='url']:focus, [type='week']:focus, input:not([type]):focus, textarea:focus {\n    border-color: #1565c0;\n    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 5px rgba(18, 89, 169, 0.7);\n    outline: none; }\n  [type='color']:disabled, [type='date']:disabled, [type='datetime']:disabled, [type='datetime-local']:disabled, [type='email']:disabled, [type='month']:disabled, [type='number']:disabled, [type='password']:disabled, [type='search']:disabled, [type='tel']:disabled, [type='text']:disabled, [type='time']:disabled, [type='url']:disabled, [type='week']:disabled, input:not([type]):disabled, textarea:disabled {\n    background-color: #f2f2f2;\n    cursor: not-allowed; }\n    [type='color']:disabled:hover, [type='date']:disabled:hover, [type='datetime']:disabled:hover, [type='datetime-local']:disabled:hover, [type='email']:disabled:hover, [type='month']:disabled:hover, [type='number']:disabled:hover, [type='password']:disabled:hover, [type='search']:disabled:hover, [type='tel']:disabled:hover, [type='text']:disabled:hover, [type='time']:disabled:hover, [type='url']:disabled:hover, [type='week']:disabled:hover, input:not([type]):disabled:hover, textarea:disabled:hover {\n      border: 1px solid #ddd; }\n  [type='color']::placeholder, [type='date']::placeholder, [type='datetime']::placeholder, [type='datetime-local']::placeholder, [type='email']::placeholder, [type='month']::placeholder, [type='number']::placeholder, [type='password']::placeholder, [type='search']::placeholder, [type='tel']::placeholder, [type='text']::placeholder, [type='time']::placeholder, [type='url']::placeholder, [type='week']::placeholder, input:not([type])::placeholder, textarea::placeholder {\n    color: #858585; }\n\ntextarea {\n  resize: vertical; }\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  display: inline;\n  margin-right: 0.375em; }\n\n[type=\"file\"] {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nselect {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nhtml {\n  box-sizing: border-box; }\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\nhtml,\nbody {\n  height: 100%; }\n\nul,\nol {\n  list-style-type: none;\n  margin: 0;\n  padding: 0; }\n\ndl {\n  margin: 0; }\n\ndt {\n  font-weight: 600;\n  margin: 0; }\n\ndd {\n  margin: 0; }\n\nfigure {\n  margin: 0; }\n\nimg,\npicture {\n  margin: 0;\n  max-width: 100%; }\n\ntable {\n  border-collapse: collapse;\n  margin: 0.75em 0;\n  table-layout: fixed;\n  width: 100%; }\n\nth {\n  border-bottom: 1px solid #a6a6a6;\n  font-weight: 600;\n  padding: 0.75em 0;\n  text-align: left; }\n\ntd {\n  border-bottom: 1px solid #ddd;\n  padding: 0.75em 0; }\n\ntr,\ntd,\nth {\n  vertical-align: middle; }\n\nbody {\n  color: #333;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  line-height: 1.5; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1.25em;\n  line-height: 1.2;\n  margin: 0 0 0.75em; }\n\np {\n  margin: 0 0 0.75em; }\n\na {\n  color: #1565c0;\n  text-decoration: none;\n  transition: color 150ms ease; }\n  a:active, a:focus, a:hover {\n    color: #104c90; }\n\nhr {\n  border-bottom: 1px solid #ddd;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  margin: 1.5em 0; }\n\n@media screen and (min-width: 900px) {\n  body {\n    margin-left: 10%;\n    margin-right: 10%; } }\n"; });
define('text!views/user/requests/create.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./create.css\"></require>\n\n  <form submit.delegate=\"create()\">\n    <label>\n      Source\n    <select value.bind=\"request.source_id\">\n      <option model.bind=\"null\">Choose</option>\n      <option repeat.for=\"country of countries.data\" model.bind=\"country.id\">\n      ${country.name}\n      </option>\n    </select>\n    </label>\n    <label>\n      Destination\n    <select value.bind=\"request.destination_id\">\n      <option model.bind=\"null\">Choose</option>\n      <option repeat.for=\"country of countries.data\" model.bind=\"country.id\">\n      ${country.name}\n      </option>\n    </select>\n    </label>\n    <label>\n      Title\n      <input type=\"text\" value.bind=\"request.title\"/>\n    </label>\n    <label>\n      Url\n      <input type=\"text\" value.bind=\"request.url\"/>\n    </label>\n    <button type=\"submit\">Create</button>\n  </form>\n\n</template>\n"; });
define('text!views/user/requests/index.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!views/login/reset.css', ['module'], function(module) { module.exports = "html {\n  box-sizing: border-box; }\n\n*, *::after, *::before {\n  box-sizing: inherit; }\n\nbutton, [type='button'], [type='reset'], [type='submit'] {\n  appearance: none;\n  background-color: #1565c0;\n  border: 0;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  -webkit-font-smoothing: antialiased;\n  font-weight: 600;\n  line-height: 1;\n  padding: 0.75em 1.5em;\n  text-align: center;\n  text-decoration: none;\n  transition: background-color 150ms ease;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  button:hover, button:focus, [type='button']:hover, [type='button']:focus, [type='reset']:hover, [type='reset']:focus, [type='submit']:hover, [type='submit']:focus {\n    background-color: #11519a;\n    color: #fff; }\n  button:disabled, [type='button']:disabled, [type='reset']:disabled, [type='submit']:disabled {\n    cursor: not-allowed;\n    opacity: 0.5; }\n    button:disabled:hover, [type='button']:disabled:hover, [type='reset']:disabled:hover, [type='submit']:disabled:hover {\n      background-color: #1565c0; }\n\nfieldset {\n  background-color: transparent;\n  border: 0;\n  margin: 0;\n  padding: 0; }\n\nlegend {\n  font-weight: 600;\n  margin-bottom: 0.375em;\n  padding: 0; }\n\nlabel {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.375em; }\n\ninput,\nselect,\ntextarea {\n  display: block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em; }\n\n[type='color'], [type='date'], [type='datetime'], [type='datetime-local'], [type='email'], [type='month'], [type='number'], [type='password'], [type='search'], [type='tel'], [type='text'], [type='time'], [type='url'], [type='week'], input:not([type]), textarea {\n  appearance: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 3px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);\n  box-sizing: border-box;\n  margin-bottom: 0.75em;\n  padding: 0.5em;\n  transition: border-color 150ms ease;\n  width: 100%; }\n  [type='color']:hover, [type='date']:hover, [type='datetime']:hover, [type='datetime-local']:hover, [type='email']:hover, [type='month']:hover, [type='number']:hover, [type='password']:hover, [type='search']:hover, [type='tel']:hover, [type='text']:hover, [type='time']:hover, [type='url']:hover, [type='week']:hover, input:not([type]):hover, textarea:hover {\n    border-color: #b1b1b1; }\n  [type='color']:focus, [type='date']:focus, [type='datetime']:focus, [type='datetime-local']:focus, [type='email']:focus, [type='month']:focus, [type='number']:focus, [type='password']:focus, [type='search']:focus, [type='tel']:focus, [type='text']:focus, [type='time']:focus, [type='url']:focus, [type='week']:focus, input:not([type]):focus, textarea:focus {\n    border-color: #1565c0;\n    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 5px rgba(18, 89, 169, 0.7);\n    outline: none; }\n  [type='color']:disabled, [type='date']:disabled, [type='datetime']:disabled, [type='datetime-local']:disabled, [type='email']:disabled, [type='month']:disabled, [type='number']:disabled, [type='password']:disabled, [type='search']:disabled, [type='tel']:disabled, [type='text']:disabled, [type='time']:disabled, [type='url']:disabled, [type='week']:disabled, input:not([type]):disabled, textarea:disabled {\n    background-color: #f2f2f2;\n    cursor: not-allowed; }\n    [type='color']:disabled:hover, [type='date']:disabled:hover, [type='datetime']:disabled:hover, [type='datetime-local']:disabled:hover, [type='email']:disabled:hover, [type='month']:disabled:hover, [type='number']:disabled:hover, [type='password']:disabled:hover, [type='search']:disabled:hover, [type='tel']:disabled:hover, [type='text']:disabled:hover, [type='time']:disabled:hover, [type='url']:disabled:hover, [type='week']:disabled:hover, input:not([type]):disabled:hover, textarea:disabled:hover {\n      border: 1px solid #ddd; }\n  [type='color']::placeholder, [type='date']::placeholder, [type='datetime']::placeholder, [type='datetime-local']::placeholder, [type='email']::placeholder, [type='month']::placeholder, [type='number']::placeholder, [type='password']::placeholder, [type='search']::placeholder, [type='tel']::placeholder, [type='text']::placeholder, [type='time']::placeholder, [type='url']::placeholder, [type='week']::placeholder, input:not([type])::placeholder, textarea::placeholder {\n    color: #858585; }\n\ntextarea {\n  resize: vertical; }\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  display: inline;\n  margin-right: 0.375em; }\n\n[type=\"file\"] {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nselect {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nhtml {\n  box-sizing: border-box; }\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\nhtml,\nbody {\n  height: 100%; }\n\nul,\nol {\n  list-style-type: none;\n  margin: 0;\n  padding: 0; }\n\ndl {\n  margin: 0; }\n\ndt {\n  font-weight: 600;\n  margin: 0; }\n\ndd {\n  margin: 0; }\n\nfigure {\n  margin: 0; }\n\nimg,\npicture {\n  margin: 0;\n  max-width: 100%; }\n\ntable {\n  border-collapse: collapse;\n  margin: 0.75em 0;\n  table-layout: fixed;\n  width: 100%; }\n\nth {\n  border-bottom: 1px solid #a6a6a6;\n  font-weight: 600;\n  padding: 0.75em 0;\n  text-align: left; }\n\ntd {\n  border-bottom: 1px solid #ddd;\n  padding: 0.75em 0; }\n\ntr,\ntd,\nth {\n  vertical-align: middle; }\n\nbody {\n  color: #333;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  line-height: 1.5; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1.25em;\n  line-height: 1.2;\n  margin: 0 0 0.75em; }\n\np {\n  margin: 0 0 0.75em; }\n\na {\n  color: #1565c0;\n  text-decoration: none;\n  transition: color 150ms ease; }\n  a:active, a:focus, a:hover {\n    color: #104c90; }\n\nhr {\n  border-bottom: 1px solid #ddd;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  margin: 1.5em 0; }\n\n@media screen and (min-width: 900px) {\n  body {\n    margin-left: 10%;\n    margin-right: 10%; } }\n"; });
define('text!views/user/requests/requests.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./requests.css\"></require>\n  <a class=\"button\" route-href=\"route: create-request\">Create</a>\n  <ul>\n    <li repeat.for=\"request of requests.data\">\n      <span>${request.title}</span>\n    </li>\n  </ul>\n  <div >\n\n  </div>\n</template>\n"; });
define('text!views/login/signup.css', ['module'], function(module) { module.exports = "html {\n  box-sizing: border-box; }\n\n*, *::after, *::before {\n  box-sizing: inherit; }\n\nbutton, [type='button'], [type='reset'], [type='submit'] {\n  appearance: none;\n  background-color: #1565c0;\n  border: 0;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  -webkit-font-smoothing: antialiased;\n  font-weight: 600;\n  line-height: 1;\n  padding: 0.75em 1.5em;\n  text-align: center;\n  text-decoration: none;\n  transition: background-color 150ms ease;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  button:hover, button:focus, [type='button']:hover, [type='button']:focus, [type='reset']:hover, [type='reset']:focus, [type='submit']:hover, [type='submit']:focus {\n    background-color: #11519a;\n    color: #fff; }\n  button:disabled, [type='button']:disabled, [type='reset']:disabled, [type='submit']:disabled {\n    cursor: not-allowed;\n    opacity: 0.5; }\n    button:disabled:hover, [type='button']:disabled:hover, [type='reset']:disabled:hover, [type='submit']:disabled:hover {\n      background-color: #1565c0; }\n\nfieldset {\n  background-color: transparent;\n  border: 0;\n  margin: 0;\n  padding: 0; }\n\nlegend {\n  font-weight: 600;\n  margin-bottom: 0.375em;\n  padding: 0; }\n\nlabel {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.375em; }\n\ninput,\nselect,\ntextarea {\n  display: block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em; }\n\n[type='color'], [type='date'], [type='datetime'], [type='datetime-local'], [type='email'], [type='month'], [type='number'], [type='password'], [type='search'], [type='tel'], [type='text'], [type='time'], [type='url'], [type='week'], input:not([type]), textarea {\n  appearance: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 3px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);\n  box-sizing: border-box;\n  margin-bottom: 0.75em;\n  padding: 0.5em;\n  transition: border-color 150ms ease;\n  width: 100%; }\n  [type='color']:hover, [type='date']:hover, [type='datetime']:hover, [type='datetime-local']:hover, [type='email']:hover, [type='month']:hover, [type='number']:hover, [type='password']:hover, [type='search']:hover, [type='tel']:hover, [type='text']:hover, [type='time']:hover, [type='url']:hover, [type='week']:hover, input:not([type]):hover, textarea:hover {\n    border-color: #b1b1b1; }\n  [type='color']:focus, [type='date']:focus, [type='datetime']:focus, [type='datetime-local']:focus, [type='email']:focus, [type='month']:focus, [type='number']:focus, [type='password']:focus, [type='search']:focus, [type='tel']:focus, [type='text']:focus, [type='time']:focus, [type='url']:focus, [type='week']:focus, input:not([type]):focus, textarea:focus {\n    border-color: #1565c0;\n    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 5px rgba(18, 89, 169, 0.7);\n    outline: none; }\n  [type='color']:disabled, [type='date']:disabled, [type='datetime']:disabled, [type='datetime-local']:disabled, [type='email']:disabled, [type='month']:disabled, [type='number']:disabled, [type='password']:disabled, [type='search']:disabled, [type='tel']:disabled, [type='text']:disabled, [type='time']:disabled, [type='url']:disabled, [type='week']:disabled, input:not([type]):disabled, textarea:disabled {\n    background-color: #f2f2f2;\n    cursor: not-allowed; }\n    [type='color']:disabled:hover, [type='date']:disabled:hover, [type='datetime']:disabled:hover, [type='datetime-local']:disabled:hover, [type='email']:disabled:hover, [type='month']:disabled:hover, [type='number']:disabled:hover, [type='password']:disabled:hover, [type='search']:disabled:hover, [type='tel']:disabled:hover, [type='text']:disabled:hover, [type='time']:disabled:hover, [type='url']:disabled:hover, [type='week']:disabled:hover, input:not([type]):disabled:hover, textarea:disabled:hover {\n      border: 1px solid #ddd; }\n  [type='color']::placeholder, [type='date']::placeholder, [type='datetime']::placeholder, [type='datetime-local']::placeholder, [type='email']::placeholder, [type='month']::placeholder, [type='number']::placeholder, [type='password']::placeholder, [type='search']::placeholder, [type='tel']::placeholder, [type='text']::placeholder, [type='time']::placeholder, [type='url']::placeholder, [type='week']::placeholder, input:not([type])::placeholder, textarea::placeholder {\n    color: #858585; }\n\ntextarea {\n  resize: vertical; }\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  display: inline;\n  margin-right: 0.375em; }\n\n[type=\"file\"] {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nselect {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nhtml {\n  box-sizing: border-box; }\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\nhtml,\nbody {\n  height: 100%; }\n\nul,\nol {\n  list-style-type: none;\n  margin: 0;\n  padding: 0; }\n\ndl {\n  margin: 0; }\n\ndt {\n  font-weight: 600;\n  margin: 0; }\n\ndd {\n  margin: 0; }\n\nfigure {\n  margin: 0; }\n\nimg,\npicture {\n  margin: 0;\n  max-width: 100%; }\n\ntable {\n  border-collapse: collapse;\n  margin: 0.75em 0;\n  table-layout: fixed;\n  width: 100%; }\n\nth {\n  border-bottom: 1px solid #a6a6a6;\n  font-weight: 600;\n  padding: 0.75em 0;\n  text-align: left; }\n\ntd {\n  border-bottom: 1px solid #ddd;\n  padding: 0.75em 0; }\n\ntr,\ntd,\nth {\n  vertical-align: middle; }\n\nbody {\n  color: #333;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  line-height: 1.5; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1.25em;\n  line-height: 1.2;\n  margin: 0 0 0.75em; }\n\np {\n  margin: 0 0 0.75em; }\n\na {\n  color: #1565c0;\n  text-decoration: none;\n  transition: color 150ms ease; }\n  a:active, a:focus, a:hover {\n    color: #104c90; }\n\nhr {\n  border-bottom: 1px solid #ddd;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  margin: 1.5em 0; }\n\n@media screen and (min-width: 900px) {\n  body {\n    margin-left: 10%;\n    margin-right: 10%; } }\n"; });
define('text!views/user/trips/trips.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./trips.css\"></require>\n  <p>trips</p>\n</template>\n"; });
define('text!views/requests/request/index.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!views/requests/requests.css', ['module'], function(module) { module.exports = "html {\n  box-sizing: border-box; }\n\n*, *::after, *::before {\n  box-sizing: inherit; }\n\nbutton, [type='button'], [type='reset'], [type='submit'] {\n  appearance: none;\n  background-color: #1565c0;\n  border: 0;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  -webkit-font-smoothing: antialiased;\n  font-weight: 600;\n  line-height: 1;\n  padding: 0.75em 1.5em;\n  text-align: center;\n  text-decoration: none;\n  transition: background-color 150ms ease;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  button:hover, button:focus, [type='button']:hover, [type='button']:focus, [type='reset']:hover, [type='reset']:focus, [type='submit']:hover, [type='submit']:focus {\n    background-color: #11519a;\n    color: #fff; }\n  button:disabled, [type='button']:disabled, [type='reset']:disabled, [type='submit']:disabled {\n    cursor: not-allowed;\n    opacity: 0.5; }\n    button:disabled:hover, [type='button']:disabled:hover, [type='reset']:disabled:hover, [type='submit']:disabled:hover {\n      background-color: #1565c0; }\n\nfieldset {\n  background-color: transparent;\n  border: 0;\n  margin: 0;\n  padding: 0; }\n\nlegend {\n  font-weight: 600;\n  margin-bottom: 0.375em;\n  padding: 0; }\n\nlabel {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.375em; }\n\ninput,\nselect,\ntextarea {\n  display: block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em; }\n\n[type='color'], [type='date'], [type='datetime'], [type='datetime-local'], [type='email'], [type='month'], [type='number'], [type='password'], [type='search'], [type='tel'], [type='text'], [type='time'], [type='url'], [type='week'], input:not([type]), textarea {\n  appearance: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 3px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);\n  box-sizing: border-box;\n  margin-bottom: 0.75em;\n  padding: 0.5em;\n  transition: border-color 150ms ease;\n  width: 100%; }\n  [type='color']:hover, [type='date']:hover, [type='datetime']:hover, [type='datetime-local']:hover, [type='email']:hover, [type='month']:hover, [type='number']:hover, [type='password']:hover, [type='search']:hover, [type='tel']:hover, [type='text']:hover, [type='time']:hover, [type='url']:hover, [type='week']:hover, input:not([type]):hover, textarea:hover {\n    border-color: #b1b1b1; }\n  [type='color']:focus, [type='date']:focus, [type='datetime']:focus, [type='datetime-local']:focus, [type='email']:focus, [type='month']:focus, [type='number']:focus, [type='password']:focus, [type='search']:focus, [type='tel']:focus, [type='text']:focus, [type='time']:focus, [type='url']:focus, [type='week']:focus, input:not([type]):focus, textarea:focus {\n    border-color: #1565c0;\n    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 5px rgba(18, 89, 169, 0.7);\n    outline: none; }\n  [type='color']:disabled, [type='date']:disabled, [type='datetime']:disabled, [type='datetime-local']:disabled, [type='email']:disabled, [type='month']:disabled, [type='number']:disabled, [type='password']:disabled, [type='search']:disabled, [type='tel']:disabled, [type='text']:disabled, [type='time']:disabled, [type='url']:disabled, [type='week']:disabled, input:not([type]):disabled, textarea:disabled {\n    background-color: #f2f2f2;\n    cursor: not-allowed; }\n    [type='color']:disabled:hover, [type='date']:disabled:hover, [type='datetime']:disabled:hover, [type='datetime-local']:disabled:hover, [type='email']:disabled:hover, [type='month']:disabled:hover, [type='number']:disabled:hover, [type='password']:disabled:hover, [type='search']:disabled:hover, [type='tel']:disabled:hover, [type='text']:disabled:hover, [type='time']:disabled:hover, [type='url']:disabled:hover, [type='week']:disabled:hover, input:not([type]):disabled:hover, textarea:disabled:hover {\n      border: 1px solid #ddd; }\n  [type='color']::placeholder, [type='date']::placeholder, [type='datetime']::placeholder, [type='datetime-local']::placeholder, [type='email']::placeholder, [type='month']::placeholder, [type='number']::placeholder, [type='password']::placeholder, [type='search']::placeholder, [type='tel']::placeholder, [type='text']::placeholder, [type='time']::placeholder, [type='url']::placeholder, [type='week']::placeholder, input:not([type])::placeholder, textarea::placeholder {\n    color: #858585; }\n\ntextarea {\n  resize: vertical; }\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  display: inline;\n  margin-right: 0.375em; }\n\n[type=\"file\"] {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nselect {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nhtml {\n  box-sizing: border-box; }\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\nhtml,\nbody {\n  height: 100%; }\n\nul,\nol {\n  list-style-type: none;\n  margin: 0;\n  padding: 0; }\n\ndl {\n  margin: 0; }\n\ndt {\n  font-weight: 600;\n  margin: 0; }\n\ndd {\n  margin: 0; }\n\nfigure {\n  margin: 0; }\n\nimg,\npicture {\n  margin: 0;\n  max-width: 100%; }\n\ntable {\n  border-collapse: collapse;\n  margin: 0.75em 0;\n  table-layout: fixed;\n  width: 100%; }\n\nth {\n  border-bottom: 1px solid #a6a6a6;\n  font-weight: 600;\n  padding: 0.75em 0;\n  text-align: left; }\n\ntd {\n  border-bottom: 1px solid #ddd;\n  padding: 0.75em 0; }\n\ntr,\ntd,\nth {\n  vertical-align: middle; }\n\nbody {\n  color: #333;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  line-height: 1.5; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1.25em;\n  line-height: 1.2;\n  margin: 0 0 0.75em; }\n\np {\n  margin: 0 0 0.75em; }\n\na {\n  color: #1565c0;\n  text-decoration: none;\n  transition: color 150ms ease; }\n  a:active, a:focus, a:hover {\n    color: #104c90; }\n\nhr {\n  border-bottom: 1px solid #ddd;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  margin: 1.5em 0; }\n\n@media screen and (min-width: 900px) {\n  body {\n    margin-left: 10%;\n    margin-right: 10%; } }\n\n.search-bar {\n  display: inline-block;\n  margin: 1em 1em 1em 1em;\n  min-width: 50%; }\n\n.search-filters {\n  display: inline-block; }\n\n.request-card {\n  max-width: 1200px;\n  margin-left: auto;\n  margin-right: auto;\n  float: left;\n  display: block;\n  margin-right: 2.35765%;\n  width: 31.76157%; }\n  .request-card::after {\n    clear: both;\n    content: \"\";\n    display: block; }\n  .request-card:last-child {\n    margin-right: 0; }\n\n.cards {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between; }\n"; });
define('text!views/requests/request/request.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./request.css\"></require>\n  <section>\n    <h3>${request.data.title}</h3>\n    <div class=\"source\">\n      <label>\n        Source:\n        <span>\n          ${request.data.source.name}\n        </span>\n      </label>\n    </div>\n    <div class=\"destination\">\n      <label>\n        Destination:\n        <span>\n          ${request.data.destination.name}\n        </span>\n      </label>\n    </div>\n    <div class=\"image\">\n      \n    </div>\n    <div class=\"url\">\n      <label>\n        Url:\n        <span>\n          ${request.data.url}\n        </span>\n      </label>\n    </div>\n\n  </section>\n</template>\n"; });
define('text!resources/elements/navbar/navbar.css', ['module'], function(module) { module.exports = ".nav-container {\n  display: flex;\n  flex-flow: row nowrap;\n  justify-content: space-between; }\n\n.logo {\n  font-size: 1.10em;\n  margin-left: 20px;\n  margin-top: 10px; }\n\n.signup {\n  font-size: 1.10em;\n  margin-right: 20px;\n  margin-top: 10px; }\n"; });
define('text!resources/elements/signin/signin.css', ['module'], function(module) { module.exports = ".modal-footer {\n  display: block;\n  padding: 0px;\n  padding-right: 17px;\n  padding-bottom: 12px; }\n"; });
define('text!views/user/requests/create.css', ['module'], function(module) { module.exports = ""; });
define('text!views/user/requests/requests.css', ['module'], function(module) { module.exports = ""; });
define('text!views/user/trips/trips.css', ['module'], function(module) { module.exports = ""; });
define('text!views/user/requests/request/index.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!views/requests/request/request.css', ['module'], function(module) { module.exports = ""; });
define('text!views/user/requests/request/request.html', ['module'], function(module) { module.exports = ""; });
define('text!views/user/requests/request/request.css', ['module'], function(module) { module.exports = ""; });
define('text!views/user/trips/trip/trip.html', ['module'], function(module) { module.exports = ""; });
define('text!views/user/trips/trip/trip.css', ['module'], function(module) { module.exports = ""; });
define('text!views/requests/components/countries/countries.html', ['module'], function(module) { module.exports = "<template>\n  <label>\n    ${label}\n    <select value.bind=\"changedValue\" change.trigger=\"onChange(changedValue)\">\n      <option repeat.for=\"value of values\" model.bind=\"value.id\">${value.name}</option>\n    </select>\n  </label>\n</template>\n"; });
define('text!views/requests/components/request-card/request-card.css', ['module'], function(module) { module.exports = "html {\n  box-sizing: border-box; }\n\n*, *::after, *::before {\n  box-sizing: inherit; }\n\nbutton, [type='button'], [type='reset'], [type='submit'] {\n  appearance: none;\n  background-color: #1565c0;\n  border: 0;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  -webkit-font-smoothing: antialiased;\n  font-weight: 600;\n  line-height: 1;\n  padding: 0.75em 1.5em;\n  text-align: center;\n  text-decoration: none;\n  transition: background-color 150ms ease;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  button:hover, button:focus, [type='button']:hover, [type='button']:focus, [type='reset']:hover, [type='reset']:focus, [type='submit']:hover, [type='submit']:focus {\n    background-color: #11519a;\n    color: #fff; }\n  button:disabled, [type='button']:disabled, [type='reset']:disabled, [type='submit']:disabled {\n    cursor: not-allowed;\n    opacity: 0.5; }\n    button:disabled:hover, [type='button']:disabled:hover, [type='reset']:disabled:hover, [type='submit']:disabled:hover {\n      background-color: #1565c0; }\n\nfieldset {\n  background-color: transparent;\n  border: 0;\n  margin: 0;\n  padding: 0; }\n\nlegend {\n  font-weight: 600;\n  margin-bottom: 0.375em;\n  padding: 0; }\n\nlabel {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.375em; }\n\ninput,\nselect,\ntextarea {\n  display: block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em; }\n\n[type='color'], [type='date'], [type='datetime'], [type='datetime-local'], [type='email'], [type='month'], [type='number'], [type='password'], [type='search'], [type='tel'], [type='text'], [type='time'], [type='url'], [type='week'], input:not([type]), textarea {\n  appearance: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 3px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);\n  box-sizing: border-box;\n  margin-bottom: 0.75em;\n  padding: 0.5em;\n  transition: border-color 150ms ease;\n  width: 100%; }\n  [type='color']:hover, [type='date']:hover, [type='datetime']:hover, [type='datetime-local']:hover, [type='email']:hover, [type='month']:hover, [type='number']:hover, [type='password']:hover, [type='search']:hover, [type='tel']:hover, [type='text']:hover, [type='time']:hover, [type='url']:hover, [type='week']:hover, input:not([type]):hover, textarea:hover {\n    border-color: #b1b1b1; }\n  [type='color']:focus, [type='date']:focus, [type='datetime']:focus, [type='datetime-local']:focus, [type='email']:focus, [type='month']:focus, [type='number']:focus, [type='password']:focus, [type='search']:focus, [type='tel']:focus, [type='text']:focus, [type='time']:focus, [type='url']:focus, [type='week']:focus, input:not([type]):focus, textarea:focus {\n    border-color: #1565c0;\n    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 5px rgba(18, 89, 169, 0.7);\n    outline: none; }\n  [type='color']:disabled, [type='date']:disabled, [type='datetime']:disabled, [type='datetime-local']:disabled, [type='email']:disabled, [type='month']:disabled, [type='number']:disabled, [type='password']:disabled, [type='search']:disabled, [type='tel']:disabled, [type='text']:disabled, [type='time']:disabled, [type='url']:disabled, [type='week']:disabled, input:not([type]):disabled, textarea:disabled {\n    background-color: #f2f2f2;\n    cursor: not-allowed; }\n    [type='color']:disabled:hover, [type='date']:disabled:hover, [type='datetime']:disabled:hover, [type='datetime-local']:disabled:hover, [type='email']:disabled:hover, [type='month']:disabled:hover, [type='number']:disabled:hover, [type='password']:disabled:hover, [type='search']:disabled:hover, [type='tel']:disabled:hover, [type='text']:disabled:hover, [type='time']:disabled:hover, [type='url']:disabled:hover, [type='week']:disabled:hover, input:not([type]):disabled:hover, textarea:disabled:hover {\n      border: 1px solid #ddd; }\n  [type='color']::placeholder, [type='date']::placeholder, [type='datetime']::placeholder, [type='datetime-local']::placeholder, [type='email']::placeholder, [type='month']::placeholder, [type='number']::placeholder, [type='password']::placeholder, [type='search']::placeholder, [type='tel']::placeholder, [type='text']::placeholder, [type='time']::placeholder, [type='url']::placeholder, [type='week']::placeholder, input:not([type])::placeholder, textarea::placeholder {\n    color: #858585; }\n\ntextarea {\n  resize: vertical; }\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  display: inline;\n  margin-right: 0.375em; }\n\n[type=\"file\"] {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nselect {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nhtml {\n  box-sizing: border-box; }\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\nhtml,\nbody {\n  height: 100%; }\n\nul,\nol {\n  list-style-type: none;\n  margin: 0;\n  padding: 0; }\n\ndl {\n  margin: 0; }\n\ndt {\n  font-weight: 600;\n  margin: 0; }\n\ndd {\n  margin: 0; }\n\nfigure {\n  margin: 0; }\n\nimg,\npicture {\n  margin: 0;\n  max-width: 100%; }\n\ntable {\n  border-collapse: collapse;\n  margin: 0.75em 0;\n  table-layout: fixed;\n  width: 100%; }\n\nth {\n  border-bottom: 1px solid #a6a6a6;\n  font-weight: 600;\n  padding: 0.75em 0;\n  text-align: left; }\n\ntd {\n  border-bottom: 1px solid #ddd;\n  padding: 0.75em 0; }\n\ntr,\ntd,\nth {\n  vertical-align: middle; }\n\nbody {\n  color: #333;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  line-height: 1.5; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1.25em;\n  line-height: 1.2;\n  margin: 0 0 0.75em; }\n\np {\n  margin: 0 0 0.75em; }\n\na {\n  color: #1565c0;\n  text-decoration: none;\n  transition: color 150ms ease; }\n  a:active, a:focus, a:hover {\n    color: #104c90; }\n\nhr {\n  border-bottom: 1px solid #ddd;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  margin: 1.5em 0; }\n\n@media screen and (min-width: 900px) {\n  body {\n    margin-left: 10%;\n    margin-right: 10%; } }\n\n.card {\n  background-color: #f7f7f7;\n  border: 1px solid #ddd;\n  border-radius: 3px;\n  box-shadow: 0 2px 4px #e6e6e6;\n  flex-basis: 17em;\n  flex-grow: 1;\n  margin: 0 1em 1.5em 1em;\n  position: relative;\n  transition: all 0.2s ease-in-out; }\n  .card .card-image {\n    background-color: #F8F2B4;\n    height: 150px;\n    max-height: 150px;\n    overflow: hidden; }\n    .card .card-image img {\n      border-top-left-radius: 3px;\n      border-top-right-radius: 3px;\n      opacity: 1;\n      transition: all 0.2s ease-in-out;\n      width: 100%; }\n  .card .card-header {\n    background-color: #f7f7f7;\n    border-bottom: 1px solid #ddd;\n    border-radius: 3px 3px 0 0;\n    font-weight: bold;\n    line-height: 1.5em;\n    padding: 0.5em 0.75em;\n    transition: all 0.2s ease-in-out; }\n  .card .card-copy {\n    font-size: 0.9em;\n    line-height: 1.5em;\n    padding: 0.75em 0.75em; }\n    .card .card-copy p {\n      margin: 0 0 0.75em; }\n  .card:focus img, .card:hover img {\n    opacity: 0.7; }\n  .card:active {\n    background-color: #f7f7f7; }\n    .card:active .card-header {\n      background-color: #f7f7f7; }\n\n/* button group */\n.button-group input {\n  display: none; }\n\n.button-group label {\n  float: left; }\n  .button-group label .button-group-item {\n    background: #fff;\n    border-radius: 0;\n    color: gray;\n    cursor: pointer;\n    display: inline-block;\n    font-size: 1em;\n    font-weight: normal;\n    line-height: 1;\n    padding: 0.75em 1em;\n    border-bottom: 1px solid silver;\n    border-left: 0;\n    border-right: 1px solid #eeeeee;\n    border-top: 1px solid silver;\n    width: auto; }\n    .button-group label .button-group-item:focus, .button-group label .button-group-item:hover {\n      background-color: #f7f7f7; }\n  .button-group label:first-child .button-group-item {\n    border-top-left-radius: 3px;\n    border-top-right-radius: 3px;\n    border-top: 1px solid silver;\n    border-bottom-left-radius: 3px;\n    border-left: 1px solid silver;\n    border-top-left-radius: 3px;\n    border-top-right-radius: 0; }\n  .button-group label:last-child .button-group-item {\n    border-bottom-left-radius: 3px;\n    border-bottom-right-radius: 3px;\n    border-bottom: 1px solid silver;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 3px;\n    border-right: 1px solid silver;\n    border-top-right-radius: 3px; }\n  .button-group label input:checked + .button-group-item {\n    background: #1565c0;\n    border: 1px solid #0d417b;\n    box-shadow: inset 0 1px 2px #104d92;\n    color: white; }\n"; });
define('text!views/requests/components/request-card/request-card.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./request-card.css\"></require>\n\n  <div class=\"card\">\n    <a route-href=\"route: request; params.bind: {request_id: request.id}\">\n      <div class=\"card-image\">\n        <img src.bind=\"request.poster\" alt=\"\">\n      </div>\n      <div class=\"card-header\">\n        ${request.title}\n      </div>\n    </a>\n    <div class=\"card-copy\">\n      <div class=\"button-group\">\n        <label>\n          <input type=\"radio\" name=\"${request.id}\" value=\"item\">\n          <span class=\"button-group-item\">Approve</span>\n        </label>\n        <label>\n          <input type=\"radio\" name=\"${request.id}\" value=\"other-item\">\n          <span class=\"button-group-item\">Reject</span>\n        </label>\n        <label>\n          <input type=\"radio\" name=\"${request.id}\" value=\"other-item\">\n          <span class=\"button-group-item\">Respond</span>\n        </label>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!views/requests/components/search/search.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./search.css\"></require>\n\n  <form class=\"search-form\" role=\"search\">\n    <input type=\"search\" placeholder=\"Enter Search\" />\n    <button type=\"submit\">\n      <img src=\"https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/search-icon-black.png\" alt=\"Search Icon\">\n    </button>\n  </form>\n</template>\n"; });
define('text!views/requests/components/search/search.css', ['module'], function(module) { module.exports = "html {\n  box-sizing: border-box; }\n\n*, *::after, *::before {\n  box-sizing: inherit; }\n\nbutton, [type='button'], [type='reset'], [type='submit'] {\n  appearance: none;\n  background-color: #1565c0;\n  border: 0;\n  border-radius: 3px;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  -webkit-font-smoothing: antialiased;\n  font-weight: 600;\n  line-height: 1;\n  padding: 0.75em 1.5em;\n  text-align: center;\n  text-decoration: none;\n  transition: background-color 150ms ease;\n  user-select: none;\n  vertical-align: middle;\n  white-space: nowrap; }\n  button:hover, button:focus, [type='button']:hover, [type='button']:focus, [type='reset']:hover, [type='reset']:focus, [type='submit']:hover, [type='submit']:focus {\n    background-color: #11519a;\n    color: #fff; }\n  button:disabled, [type='button']:disabled, [type='reset']:disabled, [type='submit']:disabled {\n    cursor: not-allowed;\n    opacity: 0.5; }\n    button:disabled:hover, [type='button']:disabled:hover, [type='reset']:disabled:hover, [type='submit']:disabled:hover {\n      background-color: #1565c0; }\n\nfieldset {\n  background-color: transparent;\n  border: 0;\n  margin: 0;\n  padding: 0; }\n\nlegend {\n  font-weight: 600;\n  margin-bottom: 0.375em;\n  padding: 0; }\n\nlabel {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 0.375em; }\n\ninput,\nselect,\ntextarea {\n  display: block;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em; }\n\n[type='color'], [type='date'], [type='datetime'], [type='datetime-local'], [type='email'], [type='month'], [type='number'], [type='password'], [type='search'], [type='tel'], [type='text'], [type='time'], [type='url'], [type='week'], input:not([type]), textarea {\n  appearance: none;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 3px;\n  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);\n  box-sizing: border-box;\n  margin-bottom: 0.75em;\n  padding: 0.5em;\n  transition: border-color 150ms ease;\n  width: 100%; }\n  [type='color']:hover, [type='date']:hover, [type='datetime']:hover, [type='datetime-local']:hover, [type='email']:hover, [type='month']:hover, [type='number']:hover, [type='password']:hover, [type='search']:hover, [type='tel']:hover, [type='text']:hover, [type='time']:hover, [type='url']:hover, [type='week']:hover, input:not([type]):hover, textarea:hover {\n    border-color: #b1b1b1; }\n  [type='color']:focus, [type='date']:focus, [type='datetime']:focus, [type='datetime-local']:focus, [type='email']:focus, [type='month']:focus, [type='number']:focus, [type='password']:focus, [type='search']:focus, [type='tel']:focus, [type='text']:focus, [type='time']:focus, [type='url']:focus, [type='week']:focus, input:not([type]):focus, textarea:focus {\n    border-color: #1565c0;\n    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 5px rgba(18, 89, 169, 0.7);\n    outline: none; }\n  [type='color']:disabled, [type='date']:disabled, [type='datetime']:disabled, [type='datetime-local']:disabled, [type='email']:disabled, [type='month']:disabled, [type='number']:disabled, [type='password']:disabled, [type='search']:disabled, [type='tel']:disabled, [type='text']:disabled, [type='time']:disabled, [type='url']:disabled, [type='week']:disabled, input:not([type]):disabled, textarea:disabled {\n    background-color: #f2f2f2;\n    cursor: not-allowed; }\n    [type='color']:disabled:hover, [type='date']:disabled:hover, [type='datetime']:disabled:hover, [type='datetime-local']:disabled:hover, [type='email']:disabled:hover, [type='month']:disabled:hover, [type='number']:disabled:hover, [type='password']:disabled:hover, [type='search']:disabled:hover, [type='tel']:disabled:hover, [type='text']:disabled:hover, [type='time']:disabled:hover, [type='url']:disabled:hover, [type='week']:disabled:hover, input:not([type]):disabled:hover, textarea:disabled:hover {\n      border: 1px solid #ddd; }\n  [type='color']::placeholder, [type='date']::placeholder, [type='datetime']::placeholder, [type='datetime-local']::placeholder, [type='email']::placeholder, [type='month']::placeholder, [type='number']::placeholder, [type='password']::placeholder, [type='search']::placeholder, [type='tel']::placeholder, [type='text']::placeholder, [type='time']::placeholder, [type='url']::placeholder, [type='week']::placeholder, input:not([type])::placeholder, textarea::placeholder {\n    color: #858585; }\n\ntextarea {\n  resize: vertical; }\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  display: inline;\n  margin-right: 0.375em; }\n\n[type=\"file\"] {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nselect {\n  margin-bottom: 0.75em;\n  width: 100%; }\n\nhtml {\n  box-sizing: border-box; }\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit; }\n\nhtml,\nbody {\n  height: 100%; }\n\nul,\nol {\n  list-style-type: none;\n  margin: 0;\n  padding: 0; }\n\ndl {\n  margin: 0; }\n\ndt {\n  font-weight: 600;\n  margin: 0; }\n\ndd {\n  margin: 0; }\n\nfigure {\n  margin: 0; }\n\nimg,\npicture {\n  margin: 0;\n  max-width: 100%; }\n\ntable {\n  border-collapse: collapse;\n  margin: 0.75em 0;\n  table-layout: fixed;\n  width: 100%; }\n\nth {\n  border-bottom: 1px solid #a6a6a6;\n  font-weight: 600;\n  padding: 0.75em 0;\n  text-align: left; }\n\ntd {\n  border-bottom: 1px solid #ddd;\n  padding: 0.75em 0; }\n\ntr,\ntd,\nth {\n  vertical-align: middle; }\n\nbody {\n  color: #333;\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1em;\n  line-height: 1.5; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: -apple-system, BlinkMacSystemFont, \"Avenir Next\", \"Avenir\", \"Segoe UI\", \"Lucida Grande\", \"Helvetica Neue\", \"Helvetica\", \"Fira Sans\", \"Roboto\", \"Noto\", \"Droid Sans\", \"Cantarell\", \"Oxygen\", \"Ubuntu\", \"Franklin Gothic Medium\", \"Century Gothic\", \"Liberation Sans\", sans-serif;\n  font-size: 1.25em;\n  line-height: 1.2;\n  margin: 0 0 0.75em; }\n\np {\n  margin: 0 0 0.75em; }\n\na {\n  color: #1565c0;\n  text-decoration: none;\n  transition: color 150ms ease; }\n  a:active, a:focus, a:hover {\n    color: #104c90; }\n\nhr {\n  border-bottom: 1px solid #ddd;\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  margin: 1.5em 0; }\n\n@media screen and (min-width: 900px) {\n  body {\n    margin-left: 10%;\n    margin-right: 10%; } }\n\nform.search-form {\n  position: relative; }\n  form.search-form input[type=search] {\n    appearance: none;\n    background-color: white;\n    border: 1px solid #ddd;\n    box-sizing: border-box;\n    display: block;\n    font-size: 1em;\n    font-style: italic;\n    margin: 0;\n    padding: 0.5em 0.5em;\n    position: relative;\n    transition: border-color;\n    width: 100%; }\n  form.search-form button[type=submit] {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    outline: none;\n    padding: 5px 10px; }\n    form.search-form button[type=submit] img {\n      height: 12px;\n      opacity: 0.7; }\n"; });
//# sourceMappingURL=app-bundle.js.map