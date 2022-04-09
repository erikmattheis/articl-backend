<template>
  <div class="modal-container" v-if="errorTitle" @click.prevent="close()">
    <transition name="scale" mode="out-in">
      <dialog open class="modal">
        <article>
          <header>
            <a href="#close" aria-label="Close" class="close" @click.prevent="close()"></a>
            <h2>{{ errorTitle }}</h2>
          </header>
          <section>
            <div class="tab" title="error">
              <vue-feather size="3rem" type="alert-triangle"></vue-feather>
            </div>
            <div class="info">
              <ul>
                <li v-if="errorMessage">{{ errorMessage }}</li>
                <li v-if="errorFileName">{{ errorFileName }}</li>
                <li v-if="errorLineNumber">{{ errorLineNumber }}</li>
                <li v-if="errorStack"><a @click="showErrorStack = true">Show error stack</a></li>
                <li v-if="showErrorStack">{{ errorStack }}</li>
              </ul>
            </div>
          </section>
          <button @click.prevent="close()">OK</button>
        </article>
      </dialog>
    </transition>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import VueFeather from 'vue-feather';

export default {
  data() {
    return {
      title: '',
      showErrorStack: '',
    };
  },
  components: {
    VueFeather,
  },
  computed: {
    ...mapGetters(['errorTitle', 'errorMessage', 'errorDetail', 'errorLineNumber', 'errorFileName', 'errorStack']),
  },
  methods: {
    close() {
      this.$store.dispatch('clearError');
    },
  },
};
</script>

<style scoped lang="scss">
  .modal-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background-color: black;
    display: flex;
  }

  .modal {
    margin: auto;
    width: 90%;
    background-color: white;
    border: 0.2rem;
  }

  article {
    max-width:100%;
  }

  section {
    overflow: auto;
    white-space: nowrap;
  }

  section div {
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tab {
    width: 6rem;
    height: 6rem;
  }

#app > div > dialog > article > section > div.info {
    height: 6rem;
    padding: 2rem;
    background-color:#fca;
    color:#f00;
  }

  .tab,
  dialog article button {
    background-color: #f00;
    color: #fff;
  }

  dialog article header a {
    color:#fca;
  }

  dialog article header a {
    color:#fff;
  }

  dialog article header,
  dialog article button:hover {
    background-color: #b30202;
    transition: background-color 0.5s ease;
  }

  dialog article header h2 {
    color:#fff;
    margin-bottom: 0;
  }
  dialog article ul li {
    max-width:40rem;
    white-space: pre-wrap;
    word-break: break-all;
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
