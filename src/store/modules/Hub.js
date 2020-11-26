import Vue from 'vue';
import * as constants from '@/store/constants';
import HubContract from '@/contracts/Hub.json';

const address = '0xe80d764da4AC5e5Cbcb37A92421d7794993E8f2e';

const state = {
  quizzes: [],
  transactionHash: null,
  txError: null,
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
  [constants.HUB_NEW_QUIZ]: ({ commit, rootState }, { description, questions, answers }) => {
    const from = rootState.Session.account;
    const value = Vue.web3.utils.toWei('0.05');
    const hub = new Vue.web3.eth.Contract(HubContract.abi, address);
    const newQuiz = hub.methods.newQuiz(
      description,
      Vue.web3.utils.utf8ToHex(JSON.stringify(questions)),
      answers,
    );
    newQuiz.estimateGas({
      from,
      value,
    })
      .then((gas) => newQuiz.send({
        gas,
        from,
        value,
      }))
      .then(({ transactionHash }) => {
        commit(constants.HUB_SET_PROPERTY, { transactionHash });
        commit(constants.HUB_SET_PROPERTY, { txError: null });
      })
      .catch(() => {
        commit(constants.HUB_SET_PROPERTY, { transactionHash: null });
        commit(constants.HUB_SET_PROPERTY, { txError: 'Error enviando el quiz' });
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
