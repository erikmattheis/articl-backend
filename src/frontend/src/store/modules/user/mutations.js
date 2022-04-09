export default {
  setUser(state, payload) {
    state.user = payload;
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  },
};
