<template>
  <nav>
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li v-for="crumb in breadcrumbs" :key="crumb.slug">
        <router-link :to="`/d/${crumb.slug}`">{{ crumb.name }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ['breadcrumbs'],
};
</script>

<style scoped>
nav a {
  text-decoration: none;
  color: #f391e3;
  display: inline-block;
  padding: 0.75rem;
  border: 1px solid transparent;
}

nav a:active,
nav a:hover,
nav a.router-link-active {
  border: 1px solid #f391e3;
}

li {
  margin: 0 0.5rem;
  display: inline-block;
}
</style>
