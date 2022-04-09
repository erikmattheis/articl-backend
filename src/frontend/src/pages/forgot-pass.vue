<template>
  <article>
    <h1>Forgot password</h1>
    <form v-if="!result">
      <label for="email">Email</label>
      <input
        v-model="email"
        type="text"
        name="email"
        id="email"
        autocomplete="email"
      />
      <button
        type="submit"
        id="reset"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Reset</span>
      </button>
    </form>
    <p v-if="result">{{ result }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </article>
</template>

<script>
export default {
  name: 'ForgotPass',
  data() {
    return {
      email: null,
      emailInvalid: null,
      errorMessage: '',
      buttonDisabled: false,
      result: null,
    };
  },
  methods: {
    resetForm() {
      this.emailInvalid = null;
      this.result = null;
    },
    checkForm() {
      return this.email !== '';
    },
    async submitForm() {
      this.resetForm();
      if (this.checkForm() === true) {
        this.buttonDisabled = true;
        this.$http({
          method: 'POST',
          url: '/auth/forgot-password',
          data: {
            email: this.email,
          },
        })
          .then((result) => {
            if (result?.data?.message) {
              this.result = result?.data?.message;
            } else {
              this.result = result.response;
            }
          })
          .catch((error) => {
            this.$store.dispatch('setError', error);
          })
          .finally(() => {
            this.buttonDisabled = false;
          });
      }
    },
  },
};
</script>
