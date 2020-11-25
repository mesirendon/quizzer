import Vue from 'vue';
import * as constants from '@/store/constants';
import HubContract from '@/contracts/Hub.json';

const address = '0xe80d764da4AC5e5Cbcb37A92421d7794993E8f2e';

const state = {
  quizzes: [],
};

const actions = {
  [constants.HUB_GET_MY_QUIZZES]: ({ commit, rootState }) => {
    const from = rootState.Session.account;
    const hub = new Vue.web3.eth.Contract(HubContract.abi, address);
    hub.methods.myQuizzes()
      .call({ from })
      .then((quizzes) => {
        commit(constants.HUB_SET_PROPERTY, { quizzes });
      });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.HUB_SET_PROPERTY]: (state, data) => {
    const [[property, value]] = Object.entries(data);
    state[property] = value;
  },
};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
