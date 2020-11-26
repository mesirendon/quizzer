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

  answerQuiz(name, id, answers, from) {
    return new Promise((resolve, reject) => {
      const answerQuiz = this.instance.methods.answerQuiz(name, id, answers);
      answerQuiz.estimateGas({ from })
        .then((gas) => answerQuiz.send({
          from,
          gas,
        }))
        .then(({ transactionHash }) => transactionHash)
        .then(resolve)
        .catch(reject);
    });
  }

  getScore(from) {
    return new Promise((resolve, reject) => {
      this.instance.methods.getScore()
        .call({ from })
        .then(({ hits, total }) => (((Number(hits) / Number(total)) * 5).toFixed(2)))
        .then(Number)
        .then(resolve)
        .catch(reject);
    });
  }

  getStudents(from) {
    return new Promise((resolve, reject) => {
      this.instance.methods.getScores()
        .call({ from })
        .then(({ addresses }) => addresses)
        .then(resolve)
        .catch(reject);
    });
  }

  async getStudentInfo(student, from) {
    return new Promise((resolve, reject) => {
      this.instance.methods.getStudentInfo(student)
        .call({ from })
        .then(({
          name,
          id,
          hits,
          total,
        }) => [
          name,
          id,
          parseFloat(((Number(hits) / Number(total)) * 5).toFixed(2)),
        ])
        .then(([name, id, score]) => ({
          name,
          id,
          score,
        }))
        .then(resolve)
        .catch(reject);
    });
  }
}
