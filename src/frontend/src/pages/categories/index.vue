<template>
  <article>
    <h1 v-if="!success">Create category</h1>
    <h1 v-else>Category created</h1>
    <form v-if="!success">
      <label for="title">Title</label>
      <input
        v-model="title"
        type="text"
        name="title"
        id="title"
      />
      <label for="slug">Slug</label>
      <input
        readonly
        v-model="slug"
        type="text"
        name="slug"
        id="slug"
      />
      <input type="text" v-model="parentSlug" name="parentSlug" iD="parentSlug"/>
      <!--
      <label for="parentSlug">Parent</label>
        <select v-model="parentSlug" id="parentSlug>" name="parentSlug">
            <option disabled value="">Please select one</option>
            <option value="0">0</option>
            <option v-for="category in categories" :key="category.slug">{{category.title}}</option>
        </select>
      -->
        <label for="desc">Description</label>
      <textarea id="desc" rows="10" cols="70"></textarea>
      <button
        type="submit"
        id="Login"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Create Category</span>
      </button>
    </form>
    <card-notification v-else success-message="Congradulations! Please check
    your email to verify your email address"></card-notification>
  </article>
</template>

<script>
import CardNotification from '@/components/ui/CardNotification.vue';

export default {
  name: 'CreateCategoryPage',
  components: {
    CardNotification,
  },
  data() {
    return {
      title: null,
      desc: null,
      parentSlug: null,
      categories: [],
      buttonDisabled: null,
      errorMessage: '',
      success: false,
      result: null,
      chrs: 0,
    };
  },
  computed: {
    slug() {
      if (!this.title) {
        return '';
      }
      let str = this.title.replace(/\s/g, '-');
      str = str.toLowerCase();
      return encodeURIComponent(str);
    },
  },
  mounted() {
    this.parentSlug = this.$route.params.slug;
  },
  params: {
    slug: String,
  },
  methods: {
    resetFormErrors() {
      this.success = null;
      this.result = null;
      this.errorMessage = '';
    },
    checkForm() {
      this.resetFormErrors();
      let passed = true;
      if (!this.title) {
        this.titleInvalid = true;
        this.errorMessage = 'Please enter a title.';
        passed = false;
      } else if (!this.slug) {
        this.slugInvalid = true;
        this.errorMessage = 'Please enter a slug.';
        passed = false;
      } else if (!this.parentSlug) {
        this.parentIdInvalid = true;
        this.errorMessage = 'Please eselect a parent category.';
        passed = false;
      }
      return passed;
    },
    async submitForm() {
      this.resetFormErrors();
      if (this.checkForm() === true) {
        this.buttonDisabled = true;
        this.$http({
          method: 'POST',
          url: '/categories',
          data: {
            title: this.title,
            slug: this.slug,
            desc: this.desc,
            parentSlug: this.parentSlug,
          },
        })
          .then((result) => {
            if (result.data) {
              this.success = true;
              this.result = result.data;
            }
          })
          .catch((error) => {
            this.$store.dispatch('setError', error);
          })
          .finally(() => {
            this.buttonDisabled = false;
          });
      } else {
        this.$store.dispatch('setError', {
          message: this.errorMessage,
        });
      }
    },
  },
};
</script>

<style scoped>
*[readonly] {
        cursor: not-allowed;

}

.success {
  border: 8px solid green;
  background-color:honeydew;
}
</style>
