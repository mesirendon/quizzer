<template>
  <router-link class="list-group-item list-group-item-action"
               :to="{name: 'quiz', params: {address}}">
    {{ description }}
  </router-link>
</template>

<script>
import Quiz from '@/handlers/quiz';

export default {
  name: 'QuizListItem',
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
    };
  },
  created() {
    this.quiz = new Quiz(this.address);
    this.quiz.eventualInfo
      .then(({ description }) => {
        this.description = description;
      });
  },
};
</script>
