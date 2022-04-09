<template>
  <header>
    <article>
      <nav>
        <ul>
          <li>
            <router-link to="/"> Articl.net </router-link>
          </li>
        </ul>
        <ul class="right">
          <li v-if="!isLoggedIn">
            <router-link to="/login" class="nav-user"> login </router-link>

            <router-link to="/register" class="nav-user">
              create account
            </router-link>
          </li>
          <li v-else>
            <a href="#" @click.prevent="logout" class="nav-user"> logout </a>
          </li>
          <li><router-link to="/categories" class="nav-user"> new category </router-link></li>
          <li>
            <router-link to="/users/me">
              <user-icon size="1.5x"></user-icon>
            </router-link>
          </li>
        </ul>
      </nav>
    </article>
  </header>
</template>

<script>
import { UserIcon } from '@zhuowenli/vue-feather-icons';
import { mapGetters } from 'vuex';
import localStorageService from '@/services/localStorageService';

export default {
  components: {
    UserIcon,
  },
  data() {
    return {
      theme: 'light',
      tokens: null,
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'accessTokenExpires', 'refreshTokenExpires']),
  },
  mounted() {
    const theme = localStorageService.get('data-theme');
    this.theme = theme !== 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.theme);
      localStorage.setItem('data-theme', this.theme);
    },
    logout() {
      this.$http({
        method: 'POST',
        url: '/auth/logout',
        data: {
          refreshTokenValue: this.$store.getters.refreshTokenValue,
        },
      })
        .then((result) => {
          if (result.data) {
            this.loggedin = false;
          }
        })
        .catch((error) => {
          this.$store.dispatch('setError', error);
        })
        .finally(() => {
          localStorage.clear();
          this.$store.dispatch('logout');
        });
    },
  },
};
</script>

<style scoped>
articl nav {
  overflow: auto;
}
.nav-user a {
  width: 5rem;
}
.nav-user {
  margin: 0 1rem;
}
</style>
