<template>
  <section>
      <div class="tab" title="success">
        <vue-feather size="60" type="check"></vue-feather>
      </div>
      <div class="info">
        <aside>{{ successMessage }}</aside>
      </div>
    </section>
</template>

<script>
import VueFeather from 'vue-feather';

export default {
  data() {
    return {
      title: '',
    };
  },
  components: {
    VueFeather,
  },
  props: {
    successMessage: String,
  },
};
</script>

<style scoped>
section {
  overflow: auto
}

section div {
    float:left;
    display: flex;
    align-items: center;
    justify-content: center;
}
.tab {
    width:4rem;
    height:4rem;
    background: #8bc34a;
}

.info {
    height: 4rem;
    background: #dcedc8;
    padding: 0 1rem;
}
</style>
