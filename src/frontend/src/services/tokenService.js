import store from '@/store/index';
import localStorageService from '@/services/localStorageService';

export function getAccessTokenExpires() {
  let { accessTokenExpires } = store.getters;
  if (!accessTokenExpires) {
    accessTokenExpires = localStorageService.get('accessTokenExpires');
    if (accessTokenExpires) {
      store.dispatch('accessTokenExpires', accessTokenExpires);
    }
  }
  return accessTokenExpires;
}

export function getAccessTokenValue() {
  let { accessTokenValue } = store.getters;
  if (!accessTokenValue) {
    accessTokenValue = localStorageService.get('accessTokenValue');
    if (accessTokenValue) {
      store.dispatch('accessTokenValue', accessTokenValue);
    }
  }
  return accessTokenValue;
}

export function getRefreshTokenExpires() {
  let { refreshTokenExpires } = store.getters;
  if (!refreshTokenExpires) {
    refreshTokenExpires = localStorageService.get('refreshTokenExpires');
    if (refreshTokenExpires) {
      store.dispatch('refreshTokenExpires', refreshTokenExpires);
    }
  }
  return refreshTokenExpires;
}

export function getRefreshTokenValue() {
  let { refreshTokenValue } = store.getters;
  if (!refreshTokenValue) {
    refreshTokenValue = localStorageService.get('refreshTokenValue');
    if (refreshTokenValue) {
      store.dispatch('refreshTokenValue', refreshTokenValue);
    }
  }
  return refreshTokenValue;
}

export function setTokensInVuex(val) {
  if (val?.access?.token) {
    store.dispatch('accessTokenValue', val.access.token);
    store.dispatch('accessTokenExpires', val.access.expires);
    store.dispatch('refreshTokenValue', val.refresh.token);
    store.dispatch('refreshTokenExpires', val.refresh.expires);
  }
}

export function setTokensInLocalStorage(val) {
  if (val?.access?.token) {
    // console.log('setting expires in local storage', val.access.expires);
    localStorageService.set('accessTokenValue', val.access.token);
    localStorageService.set('accessTokenExpires', val.access.expires);
    localStorageService.set('refreshTokenValue', val.refresh.token);
    localStorageService.set('refreshTokenExpires', val.refresh.expires);
  }
}

export function convertStringDatesToMS(serverResult) {
  if (serverResult?.data?.tokens) {
    const result = JSON.parse(JSON.stringify(serverResult));
    result.data.tokens.access.expires = Date.parse(result.data.tokens.access.expires);
    result.data.tokens.refresh.expires = Date.parse(result.data.tokens.refresh.expires);
    return result;
  }
  return {};
}
