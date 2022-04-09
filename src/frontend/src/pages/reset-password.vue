<template>
  <article>
    <h1>Reset password</h1>
    <form ng-if="!result">
      <label for="password"> New Password</label>
      <div class="toggle-password">
        <input
          v-if="showPassword"
          v-model="password"
          type="text"
          name="password"
          id="password"
        />
        <input
          v-if="!showPassword"
          v-model="password"
          type="password"
          name="password"
          id="password"
        />
        <the-button-toggle-hidden
          class="togglePasswordMask"
          @show-password="showPassword = !showPassword"
        ></the-button-toggle-hidden>
      </div>
      <label for="password2"> Confirm Password</label>
      <div class="toggle-password">
        <input
          v-if="showPassword2"
          v-model="password2"
          type="text"
          name="password2"
          id="password2"
        />
        <input
          v-if="!showPassword2"
          v-model="password2"
          type="password"
          name="password"
          id="password2"
        />
        <the-button-toggle-hidden
          class="togglePasswordMask"
          @show-password="showPassword2 = !showPassword2"
        ></the-button-toggle-hidden>
      </div>
      <div v-if="dataInvalid"></div>
      <button
        type="submit"
        id="reset"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Reset Password</span>
      </button>
      <p v-if="result" class="invalid">{{ result }}</p>
    </form>
  </article>
</template>

<script>
import TheButtonToggleHidden from '@/components/ui/TheButtonToggleHidden.vue';

export default {
  name: 'PasswordReset',
  components: {
    TheButtonToggleHidden,
  },
  data() {
    return {
      password: null,
      passwordInvalid: null,
      showPassword: false,
      password2: null,
      passwordInvalid2: null,
      showPassword2: false,
      buttonDisabled: false,
      dataInvalid: null,
      result: null,
      message: null,
    };
  },
  methods: {
    resetForm() {
      this.passwordInvalid = null;
      this.passwordInvalid2 = null;
      this.dataInvalid = false;
      this.success = null;
      this.result = null;
    },
    checkForm() {
      let passed = true;
      if (this.password === '') {
        this.passwordInvalid = true;
        this.message += 'Password may not be empty';
        passed = false;
      }
      if (this.password2 === '') {
        this.passwordInvalid = true;
        this.message += this.message && this.message.length ? ', ' : '';
        this.message += 'Password confirmation may not be empty';
        passed = false;
      }
      if (this.password !== this.password2) {
        this.dataInvalid = true;
        this.message += this.message && this.message.length ? ', ' : '';
        this.message = 'Confirmation password does not match';
        passed = false;
      }
      return passed;
    },
    async submitForm() {
      const { token } = this.$route.query;
      if (this.checkForm() === true) {
        this.buttonDisabled = true;
        this.$http({
          method: 'POST',
          url: '/auth/reset-password',
          data: {
            token,
            password: this.password,
          },
        })
          .then(() => {
            this.result = 'You have successfully changed your password.';
          })

          .catch((error) => {
            this.dataInvalid = true;
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
