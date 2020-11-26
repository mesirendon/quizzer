<template>
  <div>
    <div class="row">
      <div class="col-sm-9">
        <h1 class="display-4">{{ description }}</h1>
      </div>
      <div class="col">
        <router-link class="btn btn-warning align-middle"
                     :to="{name: 'summary', params: {address}}">
          Ver resultados del curso
        </router-link>
      </div>
    </div>
    <div v-if="score">
      <h3>Tu calificación es de {{ score }}</h3>
    </div>
    <div v-else>
      <div v-for="(question, idx) in questions" class="border border-secondary m-3 p-3 rounded"
           :key="`question-${idx}`">
        <quiz-question :statement="question.statement" :options="question.options"
                       :selected="answers[idx]" @response="updateAnswer(idx, $event)"/>
        <div class="p-3 m-2 bg-light text-dark" v-if="answers[idx] >= 0">
          {{ question.options[answers[idx]] }}
        </div>
      </div>
      <form @submit.prevent="send">
        <div class="form-group row">
          <label for="name" class="col-sm-2 col-form-label">Nombres y Apellidos</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="name" v-model="name" required
                   autocomplete="off">
          </div>
        </div>
        <div class="form-group row">
          <label for="id" class="col-sm-2 col-form-label">Identificación</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="id" v-model="id" required
                   autocomplete="off">
          </div>
        </div>
        <div class="form-group row">
          <div class="col">
            <button type="submit" class="btn btn-danger btn-block" :disabled="incomplete">
              Enviar respuestas
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Quiz from '@/handlers/quiz';
import QuizQuestion from '@/components/quizzes/QuizQuestion.vue';

export default {
  name: 'Quiz',
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      quiz: null,
      description: null,
      name: null,
      id: null,
      questions: [],
      answers: [],
      incomplete: true,
      transactionHash: null,
      score: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    updateAnswer(idx, response) {
      this.answers[idx] = response;
      this.$forceUpdate();
      this.incomplete = this.answers.some((x) => x === -1);
    },
    send() {
      this.quiz.answerQuiz(this.name, this.id, this.answers, this.account)
        .then((transactionHash) => {
          this.transactionHash = transactionHash;
          this.getScore();
        });
    },
    getScore() {
      this.quiz.getScore(this.account)
        .then((score) => {
          this.score = score;
        });
    },
  },
  components: {
    QuizQuestion,
  },
  created() {
    this.quiz = new Quiz(this.address);
    this.quiz.eventualInfo
      .then(({ description, questions }) => {
        this.description = description;
        this.questions = JSON.parse(this.$web3.utils.hexToUtf8(questions));
        this.answers = this.questions.map(() => -1);
      });
  },
};
</script>
