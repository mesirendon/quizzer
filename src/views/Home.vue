<template>
  <div class="home">
    <h1>quiZZer</h1>
    <div v-if="isLogged"></div>
    <div v-else>
      <p>quiZZer es una ÐApp (aplicación descentralizada) que permite a profesores y alumnos
        interactuar con quizzes de preguntas cerradas. Basta con tener una cuenta de ETH usando
        Metamask con suficientes fondos en la red de pruebas de Ropsten.</p>
      <p>quiZZer permite a los profesores crear un quiz como contrato inteligente estableciendo la
        descripción y preguntas con sus opciones y respuesta correcta.</p>
      <p>Los estudiantes, quienes deben tener una cuenta en la red de Ropste, pueden acceder al quiz
        y contestar las preguntas. <span class="text-danger">Solo hay un intento.</span></p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Home',
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
  },
};
</script>
