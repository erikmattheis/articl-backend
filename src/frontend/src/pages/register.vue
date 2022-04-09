<template>
  <article>
    <h1 v-if="!success">Create account</h1>
    <h1 v-else>Account created</h1>
    <form v-if="!success">
      <label for="email">Email</label>
      <input
        v-model="email"
        type="text"
        name="email"
        id="email"
        autocomplete="email"
      />
      <label for="password">Password
        <small class="lighter left-space" v-if="passwordComplexity < 3">
          Please use uppercase and lowercase letters,
        digits and special characters.</small>
      <small class="lighter left-space" v-else-if="password.length < 8">
        Please use 8 or more characters.
        </small>
      </label>
      <div class="toggle-password">
        <input
          v-if="showPassword"
          v-model="password"
          type="text"
          name="password"
          id="password"
          autocomplete="new-password"
        />
        <input
          v-if="!showPassword"
          v-model="password"
          type="password"
          name="password"
          id="password"
          autocomplete="new-password"
        />
        <the-button-toggle-hidden
          class="togglePasswordMask"
          @show="showPassword = !showPassword"
        ></the-button-toggle-hidden>
      </div>
      <label for="password2">Confirm Password</label>
      <div class="toggle-password">
        <input
          v-if="showPassword2"
          v-model="password2"
          type="text"
          name="password2"
          id="password2"
          autocomplete="new-password"
        />
        <input
          v-if="!showPassword2"
          v-model="password2"
          type="password"
          name="password2"
          id="password2"
          autocomplete="new-password"
        />
        <the-button-toggle-hidden
          class="togglePasswordMask"
          @show="showPassword2 = !showPassword2"
        ></the-button-toggle-hidden>
      </div>
      <div v-if="passwordInvalid"></div>
      <button
        type="submit"
        id="Login"
        :aria-busy="buttonDisabled"
        @click.prevent="submitForm()"
      >
        <span v-if="!buttonDisabled">Create Account</span>
      </button>
    </form>
    <card-notification v-else success-message="Congradulations! Please check
    your email to verify your email address"></card-notification>
  </article>
</template>

<script>
import TheButtonToggleHidden from '@/components/ui/TheButtonToggleHidden.vue';
import CardNotification from '@/components/ui/CardNotification.vue';

export default {
  name: 'RegisterPage',
  components: {
    TheButtonToggleHidden,
    CardNotification,
  },
  data() {
    return {
      email: null,
      emailInvalid: null,
      password: null,
      passwordInvalid: null,
      showPassword: false,
      password2: null,
      passwordInvalid2: null,
      showPassword2: false,
      buttonDisabled: false,
      passwordMismatch: false,
      passwordComplexity: 0,
      errorMessage: '',
      success: false,
      result: null,
      chrs: 0,
    };
  },
  watch: {
    password: {
      handler(val) {
        this.passwordComplexity = this.scoreChars(val);
      },
    },
  },
  methods: {
    charCounts(val) {
      return {
        numUpper: val.length - val.replace(/[A-Z]/g, '').length,
        numLower: val.length - val.replace(/[a-z]/g, '').length,
        numDigit: val.length - val.replace(/[0-9]/g, '').length,
        numSpecial: val.length - val.replace(/\W|_/g, '').length,
      };
    },
    scoreChars(val) {
      if (!val) {
        return 0;
      }
      const chars = this.charCounts(val);
      const a = chars.numUpper > 0 ? 1 : 0;
      const b = chars.numLower > 0 ? 1 : 0;
      const c = chars.numDigit > 0 ? 1 : 0;
      const d = chars.numSpecial > 0 ? 1 : 0;
      return a + b + c + d;
    },
    resetFormErrors() {
      this.emailInvalid = false;
      this.passwordInvalid = false;
      this.passwordMismatch = false;
      this.success = null;
      this.result = null;
      this.errorMessage = '';
    },
    checkForm() {
      this.resetFormErrors();
      let passed = true;
      if (!this.validateEmail(this.email)) {
        this.emailInvalid = true;
        this.errorMessage = 'Please enter a valid email.';
        passed = false;
      } else if (this.scoreChars(this.password) < 3) {
        this.passwordInvalid = true;
        this.errorMessage = 'Please choose a more complex password.';
        passed = false;
      } else if (this.password && this.password.length < 8) {
        this.passwordInvalid = true;
        this.errorMessage = 'Please choose a longer password.';
        passed = false;
      } else if (this.password !== this.password2) {
        this.passwordMismatch = true;
        this.errorMessage = 'The password fields must match.';
        passed = false;
      }
      return passed;
    },
    validateEmail(email) {
      if (!email) {
        return false;
      }
      return email.match(
        // eslint-disable-next-line
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    },
    async submitForm() {
      this.resetFormErrors();
      if (this.checkForm() === true) {
        this.buttonDisabled = true;
        this.$http({
          method: 'POST',
          url: '/auth/register',
          data: {
            nameFirst: this.nameFirst,
            nameLast: this.nameLast,
            password: this.password,
            email: this.email,
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
};

.success {
  border: 8px solid green;
  background-color:honeydew;
}
</style>
