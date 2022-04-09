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
  name: 'HomePage',
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
    this.categories = this.fetchData('0');
  },
  methods: {
    async fetchData(slug) {
      try {
        const category = await this.getCategoryPageBySlug(slug);
        this.categories = category.categories;
      } catch (error) {
        this.$store.dispatch('setError', error);
      }
    },
    getCategoryPageBySlug(slug) {
      return this.$http({
        method: 'GET',
        url: `/d/${slug || ''}`,
      });
    },
  },
};
</script>
