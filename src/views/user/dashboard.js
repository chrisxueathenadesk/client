import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/models/api';
import {constants} from '~/services/constants';
import {Payment} from '~/services/payment';
import {UserService} from '~/services/user';
import {AuthService} from 'aurelia-auth';
import {ExternalHttp} from '~/services/external-http';

@inject(Api, Router, UserService, AuthService, ExternalHttp, Payment)
export class DashboardView {
  requests = {
    params: {
      include: ['product'],
      filter: {
        'status:eq': 'confirmed'
      }
    },
    statuses: constants.requestStatus
  };
  shops = {};
  countries = {};
  constructor(api, router, userStore, auth, http, payment) {
    this.api = api;
    this.router = router;
    this.user = userStore.user;
    this.auth = auth;
    this.http = http;
    this.payment = payment;
  }

  userUpdate(fragment) {
    return this.api
      .edit('me', fragment)
      .then(success =>this.user = Object.assign(this.user, fragment))
      .catch(err => console.log(err));
  }

  upload() {
    let avatarUrl;
    this.getUploadUrl(this.avatar[0], 'avatar')
      .then((response) => {
        avatarUrl = response.signed_request.split('?')[0];
        return this.http.fetch(response.signed_request, {
          method: 'PUT',
          body: this.avatar[0]
        });
      })
      .then(success => this.userUpdate({avatar: avatarUrl}))
      .catch(err => console.log(err));
  }

  getRequests() {
    console.log(this.cards);
    setTimeout(() => {
      this.api
        .fetch('me/requests', this.requests.params)
        .then(requests => this.requests.data = requests.results)
        .catch(err => this.requests.error = err);
    });
    /* required for event propagation */
    return true;
  }

  removeCard(cardId) {
    this.payment.deleteCard(cardId)
      .then(() => this.payment.getCards())
      .then(cards => this.cards = cards.data)
      .catch(err => console.log(err));
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }

  activate() {
    this.api
      .fetch('me/requests', this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(err => this.requests.error = err);

    this.api
      .fetch('me/shops')
      .then(shops => this.shops.data = shops.results)
      .catch(err => this.shops.error = err);

    this.payment
      .getCards()
      .then(cards => this.cards = cards.data)
      .catch(err => console.log(err));

    this.api
      .fetch('countries')
      .then(countries => this.countries.data = countries.results)
      .catch(err => this.countries.error = err);
  }
}

