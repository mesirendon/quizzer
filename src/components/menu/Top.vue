<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{name: 'home'}">quiZZer</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
            aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" :to="{name: 'about'}">Acerca de...</router-link>
        </li>
      </ul>
      <div class="form-inline my-2 my-lg-0">
        <button class="btn btn-outline-primary my-2 my-sm-0" type="button" v-if="isLogged"
                @click="disconnect">
          {{ account }}
        </button>
        <button class="btn btn-outline-success my-2 my-sm-0" type="button" v-else @click="connect">
          Conectar
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Top',
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
    ...mapState({
      registeredAccount: (state) => state.Session.account,
    }),
    account() {
      return `${this.registeredAccount.substr(0, 5)}...${this.registeredAccount.substr(-5)}`;
    },
  },
  methods: {
    ...mapMutations({
      setSessionProperty: constants.SESSION_SET_PROPERTY,
    }),
    async connect() {
      try {
        // eslint-disable-next-line no-undef
        const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
        this.setSessionProperty({ account });
      } catch (e) {
        console.error(e);
      }
    },
    disconnect() {
      this.setSessionProperty({ account: null });
    },
  },
};
</script>
