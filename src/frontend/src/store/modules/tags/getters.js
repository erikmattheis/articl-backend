export default {
  tags(state) {
    return state.tags;
  },
  hasTags(state) {
    return state.tags && state.tags.length > 0;
  },
  isTag(_, getters, _2, rootGetters) {
    const { tags } = getters;
    const { userId } = rootGetters;
    return tags.some((tag) => tag.id === userId);
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
