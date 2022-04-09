<template>
  <the-header></the-header>
  <main>
    <router-view v-slot="{ Component }">
      <transition name="scale" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <the-footer></the-footer>
  <modal-error></modal-error>
</template>

<style lang="css">
body {
  border-radius: 0;
  font-size: 12px;
}
</style>

<script>
import ModalError from '@/components/ui/ModalError.vue';
import TheHeader from '@/components/layout/TheHeader.vue';
import TheFooter from '@/components/layout/TheFooter.vue';

export default {
  components: {
    TheHeader,
    TheFooter,
    ModalError,
  },
};
</script>

<style>
@import '~/node_modules/normalize.css/normalize.css';
@import '~/node_modules/the-new-css-reset/css/reset.css';
@import '~/node_modules/@picocss/pico/css/pico.css';

@import url('//fonts.googleapis.com/css2?family=Poppins&display=swap');

body,
input:-webkit-autofill::first-line,
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  font: 17px/1.3 'Poppins', sans-serif !important;
}

body * {
  border-radius: 0 !important;
}

.lighter {
  opacity: 0.7;
}

.left-space {
  padding-left: 2rem;
}

.right {
  text-align: right;
}

.error {
  padding: 1rem;
  background-color: #ffbaba;
}

.error li {
  color: #d8000c;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.1s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}
</style>
