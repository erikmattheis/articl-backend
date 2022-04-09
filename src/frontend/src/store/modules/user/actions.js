export default {
  async registerUser(context, data) {
    const { userId } = context.rootGetters['moduleName/getterName'];
    const tagData = {
      name: data.name,
      description: data.desc,
    };

    const response = await fetch('/categories.json', {
      method: 'PUT',
      body: JSON.stringify(tagData),
    });

    // const responseData = await response.json();

    if (!response.ok) {
      console.log('wasnt ok');
      // error ...
    }

    context.commit('registerTag', {
      ...tagData,
      id: userId,
    });
  },
  async loadTags(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }

    const response = await fetch('/categories.json');
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!');
      throw error;
    }

    const tags = [];

    for (let i = 0; i < responseData.categories.length; i += 1) {
      const cat = responseData.categories[i];
      const tag = {
        id: responseData.categories[cat].tag_id,
        name: responseData.categories[cat].name,
        slug: responseData.categories[cat].slug,
        parent: responseData.categories[cat].parent,
        description: responseData.categories[cat].description,
      };
      tags.push(tag);
    }

    context.commit('setTags', tags);
    context.commit('setFetchTimestamp');
  },
};
