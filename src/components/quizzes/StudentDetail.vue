<template>
  <li class="list-group-item">
    <div class="row">
      <div class="col">
        <h3>{{ studentDetails.name }}</h3>
      </div>
      <div class="col">
        <h4>{{ studentDetails.id }}</h4>
      </div>
      <div class="col">
        <h4>{{ studentDetails.score }}</h4>
      </div>
    </div>
  </li>
</template>

<script>
import { mapState } from 'vuex';
import Quiz from '@/handlers/quiz';

export default {
  name: 'StudentDetail',
  props: {
    address: {
      type: String,
      required: true,
    },
    student: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      quiz: null,
      studentDetails: {},
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  created() {
    this.quiz = new Quiz(this.address);
    this.quiz.getStudentInfo(this.student, this.account)
      .then((studentDetails) => {
        this.studentDetails = studentDetails;
      });
  },
};
</script>
