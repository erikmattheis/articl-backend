export default {
  registerTag(state, payload) {
    state.tags.push(payload);
  },
  setTags(state, payload) {
    state.tags = payload;
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  },
};
