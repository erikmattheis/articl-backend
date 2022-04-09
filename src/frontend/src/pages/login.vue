<template>
  <article>
    <h1>Log in</h1>
    <form>
      <label for="email">Email</label>
      <input
        v-model="email"
        type="text"
        name="email"
        id="email"
        autocomplete="email"
      />
      <label for="password">Password</label>
      <div class="toggle-password">
        <input
          v-if="showPassword"
          v-model="password"
          type="text"
          name="password"
          id="password"
          autocomplete="current-password"
        />
        <input
          v-if="!showPassword"
          v-model="password"
          type="password"
          name="password"
          id="password"
          autocomplete="current-password"
        />
        <the-button-toggle-hidden
          class="togglePasswordMask"
          @show="showPassword = !showPassword"
        >
        </the-button-toggle-hidden>
      </div>
      <button
        type="submit"
        id="Login"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Login</span>
      </button>
    </form>
  </article>
</template>

<script>
import TheButtonToggleHidden from '@/components/ui/TheButtonToggleHidden.vue';
import { setTokensInLocalStorage, setTokensInVuex, convertStringDatesToMS } from '@/services/tokenService';
import validateEmail from '@/services/emailValidationService';

export default {
  name: 'LoginPage',
  components: {
    TheButtonToggleHidden,
  },
  data() {
    return {
      email: null,
      emailInvalid: null,
      password: null,
      passwordInvalid: null,
      showPassword: false,
      buttonDisabled: false,
    };
  },
  methods: {
    handleLoginSuccess(serverResult) {
      if (serverResult.code > 309) {
        this.$store.dispatch('setError', serverResult);
        return;
      }
      this.resetFormErrors();
      const result = convertStringDatesToMS(serverResult);
      setTokensInLocalStorage(result.data.tokens);
      setTokensInVuex(result.data.tokens);
      if (
        this.$route.query.redirect &&
    this.$route.query.redirect !== '/login'
      ) {
        this.$router.push({
          path: this.$route.query.redirect,
        });
      } else {
        this.$router.push({
          name: 'HomePage',
        });
      }
    },
    resetFormErrors() {
      this.errorMessage = '';
    },
    checkForm() {
      let passed = true;
      if (!validateEmail.validateEmail(this.email)) {
        this.errorMessage = 'Please enter a valid email.';
        passed = false;
      } else if (this.password && this.password.length < 8) {
        this.errorMessage = 'Passwords are at least eight characters.';
        passed = false;
      }
      return passed;
    },
    async submitForm() {
      if (this.checkForm() === true) {
        this.buttonDisabled = true;
        this.$http({
          method: 'POST',
          url: '/auth/login',
          data: {
            password: this.password,
            email: this.email,
          },
        })
          .then(this.handleLoginSuccess)

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
.toggle-password {
  position: relative;
}

.togglePasswordMask {
  position: absolute;
  right: 1rem;
  top: 40%;
  transform: translateY(-40%);
  cursor: pointer;
  height: 2.2rem;
  width: 2.2rem;
}
</style>
