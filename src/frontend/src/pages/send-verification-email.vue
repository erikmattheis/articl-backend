<template>
  <article>
    <p v-html="result"></p>
  </article>
</template>

<script>
export default {
  data() {
    return {
      result: null,
    };
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: `/auth/send-verification-email?token=${this.$route.query.token}`,
    })
      .then(() => {
        this.result = 'Click the link in the email we sent to verify your address.';
      })

      .catch((error) => {
        this.$store.dispatch('setError', error);
      });
  },
};
</script>

<style scoped>
</style>
