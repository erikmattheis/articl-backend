<template>
  <li>
    <router-link :to="`/d/${slug}`">{{ name }}</router-link>
  </li>
</template>

<script>
export default {
  props: ['name', 'slug'],
};
</script>
