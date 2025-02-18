<template>
    <div>
      <h4>{{ question.text }}</h4>
      
      <div v-for="pair in question.pairs" :key="pair.term">
        <p>{{ pair.definition }}</p>
        <input v-model="userInput[pair.term]" placeholder="Enter answer" />
      </div>
      
      <button @click="checkAnswers" class="btn btn-primary mt-3">Submit</button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    props: ['question'],
    emits: ['answer-selected'],
    setup(props, { emit }) {
      const userInput = ref({});
  
      const checkAnswers = () => {
        let correct = Object.keys(userInput.value).every(
          term => userInput.value[term] === term
        );
        emit('answer-selected', correct);
      };
  
      return { userInput, checkAnswers };
    }
  };
  </script>
  