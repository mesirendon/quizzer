import Vue from 'vue';
import QuizContract from '@/contracts/Quiz.json';

export default class Quiz {
  constructor(address) {
    this.internalAddress = address;
    this.instance = new Vue.web3.eth.Contract(QuizContract.abi, address);
  }

  get address() {
    return this.internalAddress;
  }

  get eventualInfo() {
    return new Promise((resolve, reject) => {
      this.instance.methods.getInfo()
        .call()
        .then(({ description, questions }) => ({
          description,
          questions,
        }))
        .then(resolve)
        .catch(reject);
    });
  }
}
