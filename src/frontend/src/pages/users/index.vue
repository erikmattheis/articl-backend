<template>
  <form>
    <article>
      <fieldset class="grid">
        <div>
          <label for="nameFirst">First Name</label>
          <input
            v-model="nameFirst"
            type="text"
            name="nameFirst"
            id="nameFirst"
            autocomplete="given-name"
          />
        </div>
        <div>
          <label for="nameLast">Last Name</label>
          <input
            v-model="nameLast"
            type="text"
            name="nameLast"
            id="nameLast"
            autocomplete="family-name"
          />
        </div>
      </fieldset>
      <label for="email">Email</label>
      <input
        v-model="email"
        type="text"
        name="email"
        id="email"
        autocomplete="email"
      />
      <label for="institution">Institution</label>
      <input
        v-model="institution"
        type="text"
        name="institution"
        id="institution"
      />
      <label for="education">Education</label>
      <input
        v-model="education"
        type="text"
        name="education"
        id="education"
      />
      <button
        type="submit"
        id="Login"
        :aria-busy="buttonDisabled"
        @click.prevent="submitUserForm()"
      >
        <span v-if="!buttonDisabled">Save Changes</span>
      </button>

    </article>
    <article>
      <label for="password">Current Password</label>
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
        ></the-button-toggle-hidden>
      </div>
      <label for="newPassword">New Password</label>
      <div class="toggle-password">
        <input
          v-if="showNewPassword"
          v-model="newPassword"
          type="text"
          name="newPassword"
          id="newPassword"
          autocomplete="new-password"
        />
        <input
          v-if="!showNewPassword"
          v-model="newPassword"
          type="password"
          name="newPassword"
          id="newPassword"
          autocomplete="new-password"
        />
        <the-button-toggle-hidden
          class="togglePasswordMask"
          @show="showNewPassword = !showNewPassword"
        ></the-button-toggle-hidden>
      </div>
      <label for="password2">Confirm Password</label>
      <div class="toggle-password">
        <input
          v-if="showNewPassword2"
          v-model="newPassword2"
          type="text"
          name="newPassword2"
          id="newPassword2"
          autocomplete="new-password"
        />
        <input
          v-if="!showPassword2"
          v-model="newPassword2"
          type="password"
          name="newPassword2"
          id="newPassword2"
          autocomplete="new-password"
        />
        <the-button-toggle-hidden
          class="togglePasswordMask"
          @show="showNewPassword2 = !showNewPassword2"
        ></the-button-toggle-hidden>
      </div>
      <div v-if="newPasswordInvalid"></div>
      <button
        type="submit"
        id="passwordButton"
        :aria-busy="buttonDisabled2"
        @click.prevent="submitPasswordForm()"
      >
        <span v-if="!buttonDisabled2">Update Password</span>
      </button>
      <p
        v-if="result"
        class="invalid"
      >{{ result }}</p>

      <p v-if="success">
        Please verify your email address by following the instructions sent to
        {{ email }}.
      </p>
    </article>
  </form>
</template>

<script>
import TheButtonToggleHidden from '@/components/ui/TheButtonToggleHidden.vue';

export default {
  name: 'UserPage',
  components: {
    TheButtonToggleHidden,
  },
  data() {
    return {
      id: '',
      nameFirst: '',
      nameLast: '',
      institution: '',
      education: '',
      email: null,
      emailInvalid: null,
      password: null,
      passwordInvalid: null,
      showPassword: false,
      password2: null,
      passwordInvalid2: null,
      showPassword2: false,
      newPassword: null,
      newPasswordInvalid: null,
      showNewPassword: false,
      newPassword2: null,
      newPasswordInvalid2: null,
      showNewPassword2: false,
      buttonDisabled: false,
      buttonDisabled2: false,
      passwordMismatch: false,
      success: null,
      result: null,
    };
  },
  mounted() {
    let id;
    if (this.$route.params.userId) {
      id = this.$route.params.userId;
    } else if (this.$state.getters.userId) {
      id = this.$state.getters.userId;
    } else {
      throw new Error('You must have an account to view others.');
    }

    this.getUser(id);
  },
  methods: {
    resetUserForm() {
      this.emailInvalid = null;
      this.success = null;
      this.result = null;
    },
    checkUserForm() {
      let passed = true;
      if (!this.validateEmail(this.email)) {
        this.emailInvalid = true;
        passed = false;
      }
      return passed;
    },
    checkPasswordForm() {
      let passed = true;
      if (!this.validatePassword(this.newPassword)) {
        this.passwordInvalid = true;
        passed = false;
      }
      if (!this.validatePassword(this.newPassword2)) {
        this.passwordInvalid2 = true;
        passed = false;
      }
      if (this.password !== this.newPassword2) {
        this.passwordMismatch = true;
        passed = false;
      }
      return passed;
    },
    validateEmail(email) {
      return email.match(
        // eslint-disable-next-line
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    },
    validatePassword(password) {
      return password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
    },
    async getUser(id) {
      if (id) {
        this.$http({
          method: 'GET',
          url: `/users/${id}`,
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
      }
    },
    async submitPasswordForm() {
      const { token } = this.$route.query;
      if (this.checkPasswordForm() === true) {
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
