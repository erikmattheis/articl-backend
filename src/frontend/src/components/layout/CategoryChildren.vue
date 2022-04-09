<template>
  <main>
    <h3>Children: {{categories.length}}</h3>
      <nav>
        <ul>
          <li v-for="category in categories" :key="category.slug">
            <router-link to="/d/:category.slug"> {{category.title}} </router-link>
            <router-link to="/categories">
              New Category
            </router-link>
          </li>
        </ul>
    </nav>
  </main>
</template>

<script>
export default {
  props: {
    categories: Array,
  },
};
</script>

<style scoped>
articl nav {
  overflow: auto;
}
.nav-user a {
  width: 5rem;
}
.nav-user {
  margin: 0 1rem;
}
</style>
