<template>
  <div class="row">
    <div class="col">
      <h1>{{ statement }}</h1>
    </div>
    <div class="col">
      <div class="list-group">
        <template v-for="(option, idx) in options">
          <button type="button" class="list-group-item list-group-item-action"
                  :class="{active: selected === idx}"
                  :key="`option-${idx}`" @click="choose(idx)">
            {{ option }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizQuestion',
  props: {
    statement: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: Number,
      default: -1,
    },
  },
  methods: {
    choose(idx) {
      this.$emit('response', idx);
    },
  },
};
</script>
