import v from 'vue';
import router from '@/router';
import store from '@/store';
import VueJWT from 'vuejs-jwt';
import axios from 'axios';

// const CryptoJS = require('crypto-js');
// const axios = require('axios').default;

v.use(VueJWT);
export default class Employe {
  accToken;

  decAccToken;

  exp;

  refToken;

  decRefToken;

  ax;

  // constructor() {
  //   this.ax = axios;
  // }

  checkDate() {
    return (async () => {
      // new
      // eslint-disable-next-line
      this.accToken = JSON.parse(localStorage.getItem('user')).toString();
      // this.refToken = JSON.parse(localStorage.getItem('user')).refreshToken.toString();
      // console.log(this.accToken);
      // console.log(this.refToken);
      // const bytes = CryptoJS.AES.decrypt(`${this.accToken}`, store.state.fp);
      // console.log(bytes);
      // sss
      // this.decAccToken = bytes.toString(CryptoJS.enc.Utf8);
      // this.decAccToken = this.accToken.toString();
      // const bytess = CryptoJS.AES.decrypt(this.refToken, store.state.fp);
      // this.decRefToken = bytess.toString();
      // console.log(v.$jwt.decode(this.accToken).exp);
      this.exp = Date.now() > (v.$jwt.decode(this.accToken).exp * 1000);
      // this.exp = true;
      if (this.exp) {
        // call refresh token
        // console.log('♦ توکن منقضی شده ♦');
        store.commit('setLoadingOn');
        this.refresh();
      } else {
        // console.log('♦ توکن منقضی نشده، ادامه... ♦');
        setTimeout(() => {
          store.commit('setLoadingOff');
        }, 500);
      }
      return this.exp;
    })();
  }

  refresh() {
    (async () => {
      // alert(JSON.parse(localStorage.getItem('user')).refreshToken);
      axios({
        method: 'post',
        headers: {
          Authorization: `bearer ${this.decAccToken}`,
        },
        url: `${store.state.baseUrl}/api/v${store.state.apiVersion}/Accounts/refresh`,
        data: {
          AccessToken: JSON.parse(localStorage.getItem('user')).accessToken,
          RefreshToken: JSON.parse(localStorage.getItem('user')).refreshToken,
          IsApp: true,
        },
      }).then((response) => {
        if (response.data.isSuccess) {
          // console.log(response.data);
          const acc = response.data.data.accessToken;
          const reff = response.data.data.refreshToken;
          const refreshedUser = {
            // eslint-disable-next-line
            accessToken: acc,
            // eslint-disable-next-line
            refreshToken: reff,
          };
          const newuser = JSON.stringify(refreshedUser);
          localStorage.setItem('user', newuser);
          store.commit('setLoadingOff');
          router.go();
        } else {
          // console.log('response is not success');
        }
      }, (error) => {
        switch (error.response.status) {
          case 401: {
            localStorage.clear();
            router.push('/login');
            break;
          }
          default:
            break;
        }
      });
    })();
  }

  authToken() {
    this.accToken = JSON.parse(localStorage.getItem('user'));
    // const bytes = CryptoJS.AES.decrypt(this.accToken, store.state.fp);
    // console.log(bytes);
    // this.decAccToken = bytes.toString(CryptoJS.enc.Utf8);
    return `bearer ${this.accToken}`;
  }
}
