<template>
    <div class="question">
      <h4>{{ question.text }}</h4>
      
      <div v-for="(option, index) in question.options" :key="index">
        <button class="btn btn-outline-primary w-100 my-2"
          :class="{ 'btn-success': selected.includes(index) && correct, 'btn-danger': selected.includes(index) && !correct }"
          @click="selectAnswer(index)">
          {{ option }}
        </button>
      </div>
      
      <button v-if="selected.length > 0" @click="submitAnswer" class="btn btn-primary mt-3">
        Submit Answer
      </button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    props: ['question'],
    emits: ['answer-selected'],
    setup(props, { emit }) {
      const selected = ref([]);
      const correct = ref(false);
  
      const selectAnswer = (index) => {
        if (!selected.value.includes(index)) selected.value.push(index);
      };
  
      const submitAnswer = () => {
        correct.value = selected.value.every(idx => props.question.correct.includes(idx));
        emit('answer-selected', correct.value);
      };
  
      return { selected, correct, selectAnswer, submitAnswer };
    }
  };
  </script>
  