<template>
  <div class="list-group">
    <template v-for="(address, idx) in addresses">
      <quiz-list-item :address="address" :key="`quiz-address-${idx}`"/>
    </template>
  </div>
</template>

<script>
import QuizListItem from '@/components/quizzes/QuizListItem.vue';

export default {
  name: 'QuizList',
  props: {
    addresses: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    QuizListItem,
  },
};
</script>
