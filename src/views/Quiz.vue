<template>
  <div>
    <h1 class="display-4">{{ description }}</h1>
    <div v-for="(question, idx) in questions" class="border border-secondary m-3 p-3 rounded"
         :key="`question-${idx}`">
      <quiz-question :statement="question.statement" :options="question.options"
                     :selected="answers[idx]" @response="updateAnswer(idx, $event)"/>
      <div class="p-3 m-2 bg-light text-dark" v-if="answers[idx] >= 0">
        {{ question.options[answers[idx]] }}
      </div>
    </div>
  </div>
</template>

<script>
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
      questions: [],
      answers: [],
    };
  },
  methods: {
    updateAnswer(idx, response) {
      this.answers[idx] = response;
      this.$forceUpdate();
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
