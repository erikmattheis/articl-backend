<template>
  <article>
    <base-spinner v-if="isLoading"></base-spinner>
    <ul>
      <tag-link
        v-for="tag in tags"
        :key="tag.slug"
        :slug="tag.slug"
        :name="tag.name"
      />
    </ul>
  </article>
</template>

<script>
import TagLink from '@/components/layout/TagLink.vue';

export default {
  components: { TagLink },
  props: ['isLoading', 'tags'],
};
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.ul.scroll {
  margin: 4px, 4px;
  padding: 4px;
  background-color: green;
  width: 500px;
  height: 110px;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: justify;
}
</style>
