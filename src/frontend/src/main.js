import { createApp } from 'vue';
import axios from 'axios';
import {
  getAccessTokenValue, getRefreshTokenValue, setTokensInLocalStorage, setTokensInVuex,
  convertStringDatesToMS,
} from '@/services/tokenService';
import router from './router';
import store from './store/index';
import App from './App.vue';

const app = createApp(App);

function getAccessTokenFromRefreshToken() {
  const refreshToken = getRefreshTokenValue();
  return app.config.globalProperties.$http({
    method: 'POST',
    url: '/auth/refresh-tokens',
    data: {
      refreshToken,
    },
  });
}

const BASE_URL = window.location.href.indexOf('localhost') > -1 ? 'http://localhost:5000/v1' : 'https://api.articl.net/v1';
app.config.globalProperties.$http = axios.create({
  baseURL: BASE_URL,
});

app.config.globalProperties.$http.interceptors.request.use(
  (request) => {
    const req = request;

    const accessTokenValue = getAccessTokenValue();
    // console.log('should always trace', accessTokenValue);
    if (accessTokenValue) {
      req.headers.Authorization = `Bearer ${accessTokenValue}`;
    }
    return Promise.resolve(req);
  },

  (error) => Promise.reject(error),
);

function handleLoginSuccess(serverResult) {
  if (serverResult.code > 309) {
    this.$store.dispatch('setError', serverResult);
    return;
  }
  const result = convertStringDatesToMS(serverResult);
  setTokensInLocalStorage(result.data.tokens);
  setTokensInVuex(result.data.tokens);
  if (
    this.$route.query.redirect &&
this.$route.query.redirect !== '/login'
  ) {
    this.$router.push({
      path: this.$route.query.redirect,
    });
  } else {
    this.$router.push({
      name: 'HomePage',
    });
  }
}

const handleResponseError = async (error) => {
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        break;
      case 401:
        if (router.currentRoute.value.name === 'login') {
          return Promise.reject(error.response.data);
        }
        router.push({
          name: 'login',
          query: { redirect: window.location.pathname + window.location.search },
        });
        break;
      case 403: {
        try {
          const result = await getAccessTokenFromRefreshToken();
          handleLoginSuccess(result);
        } catch (err) {
          return Promise.reject(err.response.data);
        }

        /*
        router.push({
          name: 'login',
          query: { redirect: window.location.pathname + window.location.search },
        });
        */
        break;
      }
      case 502:
        this.$store.dispatch('setError', error);
        break;
      default:
        // maybe like this
        // console.log('err', error);
        store.dispatch('setError', error);
        break;
    }
  }
  return Promise.reject(error);
};

app.config.globalProperties.$http.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  },
  handleResponseError,
);

app.use(router);
app.use(store);

app.mount('#app');
