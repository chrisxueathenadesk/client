import {bindable, inject} from 'aurelia-framework';
import {UserService} from '~/services/user';
import {AuthService} from 'aurelia-auth';

@inject(UserService, AuthService)
export class Navbar {
  @bindable router;
  constructor(userStore, auth) {
    this.auth = auth;
    this.userStore = userStore;
  }

  logout() {
    this.auth.logout();
    this.userStore.clear();
  }
}
