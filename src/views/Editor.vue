<template>
  <div>
    <h1 class="display-3">Nuevo quiz</h1>
    <form @submit.prevent>
      <div class="form-group row">
        <label for="description">Descripción</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="description" v-model="description"
                 autocomplete="off">
        </div>
      </div>
    </form>
    <ul class="list-group m-3" v-if="questions.length">
      <template v-for="(question, idx) in questions">
        <li class="list-group-item d-flex justify-content-between align-items-center"
            :key="`questions-${idx}`">
          <strong>{{ question.statement }}:</strong>
          <ul>
            <template v-for="(option, jdx) in question.options">
              <li :key="`qo-${idx}-${jdx}`" :class="{'text-success': answers[idx] === jdx}">
                {{ option }}
              </li>
            </template>
          </ul>
          <button class="badge badge-primary badge-pill" @click="removeQuestion(idx)">X</button>
        </li>
      </template>
    </ul>
    <div class="row">
      <div class="col">
        <button type="button" class="btn btn-primary" @click="newQuestion">Nueva pregunta</button>
      </div>
      <div class="col">
        <button type="button" class="btn btn-danger" @click="newQuiz">Enviar quiz</button>
      </div>
    </div>
    <form class="border border-secondary m-3 p-3 rounded" v-if="form" @submit.prevent>
      <div class="form-group row">
        <div class="col-sm-10">
          <button type="button" class="btn btn-success" @click="addQuestion">
            Agregar pregunta
          </button>
        </div>
      </div>
      <div class="form-group row">
        <label for="statement" class="col-sm-2 col-form-label">Enunciado</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="statement" v-model="statement"
                 autocomplete="off">
        </div>
      </div>
      <div class="form-group row">
        <label for="optionText" class="col-sm-2 col-form-label">Nueva opción</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" id="optionText" v-model="optionText"
                 autocomplete="off">
        </div>
        <div class="col">
          <button type="button" class="btn btn-outline-primary" @click="addOption">
            Agregar opción
          </button>
        </div>
      </div>
      <div class="form-group row" v-if="options.length">
        <label for="answer" class="col-sm-2 col-form-label">Opción correcta</label>
        <div class="col-sm-10">
          <select id="answer" class="form-control" v-model="selected">
            <option v-for="(option, idx) in options" :value="idx" :key="`option-select-${idx}`">
              {{ option }}
            </option>
          </select>
        </div>
      </div>
      <hr>
      <h2 v-if="statement">{{ statement }}<span v-if="selected >= 0">: <small>{{
          (options[selected])
        }}</small></span></h2>
      <ul class="list-group" v-if="options.length">
        <template v-for="(option, idx) in options">
          <li class="list-group-item d-flex justify-content-between align-items-center"
              :key="`options-${idx}`">
            {{ option }}
            <button class="badge badge-primary badge-pill" @click="removeOption(idx)">X</button>
          </li>
        </template>
      </ul>
    </form>
    <div class="row mt-3">
      <div class="alert alert-success" role="alert" v-if="transactionHash">
        Transacción exitosa. Verificar en
        <small>
          <a :href="`https://ropsten.etherscan.io/tx/${transactionHash}`" target="_blank">
            {{transactionHash}}
          </a>
        </small>
      </div>
      <div class="alert alert-danger" role="alert" v-if="txError">
        {{ txError }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Editor',
  data() {
    return {
      description: null,
      statement: null,
      optionText: null,
      options: [],
      selected: null,
      answer: null,
      form: false,
      questions: [],
      answers: [],
    };
  },
  computed: {
    ...mapState({
      transactionHash: (state) => state.Hub.transactionHash,
      txError: (state) => state.Hub.txError,
    }),
  },
  methods: {
    ...mapActions({
      deployQuiz: constants.HUB_NEW_QUIZ,
    }),
    newQuestion() {
      this.statement = null;
      this.options = [];
      this.selected = null;
      this.answer = null;
      this.form = true;
    },
    addOption() {
      this.options.push(this.optionText);
      this.optionText = null;
    },
    removeOption(idx) {
      this.options.splice(idx, 1);
    },
    addQuestion() {
      this.questions.push({
        statement: this.statement,
        options: this.options,
      });
      this.answers.push(this.selected);
      this.statement = null;
      this.options = [];
      this.selected = null;
      this.form = false;
    },
    removeQuestion(idx) {
      this.questions.splice(idx, 1);
      this.answers.splice(idx, 1);
    },
    newQuiz() {
      this.deployQuiz({
        description: this.description,
        questions: this.questions,
        answers: this.answers,
      });
    },
  },
};
</script>
