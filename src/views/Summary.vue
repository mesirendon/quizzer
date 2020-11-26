<template>
  <div>
    <div v-if="authorized">
      <ul class="list-group">
        <template v-for="(student, idx) in studentAddresses">
          <student-detail :address="address" :student="student" :key="`student-${idx}`"/>
        </template>
      </ul>
    </div>
    <div v-else>
      <h1 class="display-1">No estás autorizado</h1>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Quiz from '@/handlers/quiz';
import StudentDetail from '@/components/quizzes/StudentDetail.vue';

export default {
  name: 'Summary',
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      quiz: null,
      authorized: true,
      studentAddresses: [],
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  components: {
    StudentDetail,
  },
  created() {
    this.quiz = new Quiz(this.address);
    this.quiz.getStudents(this.account)
      .then((addresses) => {
        this.studentAddresses = addresses;
      })
      .catch(() => {
        this.authorized = false;
      });
  },
};
</script>
