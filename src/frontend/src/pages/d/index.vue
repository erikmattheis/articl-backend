<template>
  <article>
    <h2>{{title}}</h2>
        <ul>

            <li v-for="category in categories || []" :key="category.slug">
              <router-link :to="{ name: 'CategoryPage', params: { slug: category.slug }}">
              {{category.title}}
              </router-link>
            </li>

          <li>
            <router-link :to="{ name: 'createCategoryPage', params: { slug: '0' }}">
              New Category
            </router-link>
          </li>

        </ul>

  </article>
</template>

<script>
// import TheBreadcrumbs from '@/components/layout/TheBreadcrumbs.vue';
// import CategoryChildren from '@/components/layout/CategoryChildren.vue';

export default {
  name: 'CategoryPage',
  // components: { TheBreadcrumbs, CategoryChildren },
  data() {
    return {
      isLoading: true,
      slug: null,
      title: '',
      categories: [],
    };
  },
  created() {
    this.categories = this.fetchData(this.$route.params.slug);
  },
  watch: {
    '$route.params.slug': {
      handler(slug) {
        this.fetchData(slug);
      },
      immediate: true,
    },
  },
  methods: {
    async fetchData(slug) {
      const category = await this.getCategoryPageBySlug(slug);
      this.title = category.category.length ? category.category[0].title : '';
      this.categories = category.categories;
    },
    getCategoryPageBySlug(slug) {
      return this.$http({
        method: 'GET',
        url: `/d/${slug || ''}`,
      })
        .then((result) => {
          if (result.data) {
            return result.data;
          }
          return this.$store.dispatch('setError', result);
        })
        .catch((error) => this.$store.dispatch('setError', error));
    },
  },
};
</script>
