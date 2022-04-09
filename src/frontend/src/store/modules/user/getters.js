export default {
  user(state) {
    return state.user;
  },
  shouldUpdate(state) {
    const { lastFetch } = state;
    if (!lastFetch) {
      return true;
    }
    const currentTimeStamp = new Date().getTime();
    return (currentTimeStamp - lastFetch) / 1000 > 60;
  },
};
