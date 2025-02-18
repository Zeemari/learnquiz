<template>
  <div class="quiz-container">
    <div class="quiz-content">
      <h1 class="quiz-title">Mini Quiz App</h1>

      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <p class="timer">Time Left: {{ timeLeft }}s</p>
      </div>

      <template v-if="currentQuestionIndex < questions.length">
        <div v-if="currentQuestion.type === 'multiple'" class="question-box">
          <h2 class="question-text">{{ currentQuestion.text }}</h2>
          <div class="options">
            <div
              v-for="(option, index) in currentQuestion.options"
            :key="index"
              class="option-container"
            :class="{
                selected: selectedAnswer === option,
                correct: selectedAnswer === option && option === currentQuestion.correct,
                incorrect: selectedAnswer === option && option!== currentQuestion.correct,
              }"
            >
              <button @click="selectAnswer(option)">
                {{ option }}
              </button>
              <span v-if="selectedAnswer === option" class="icon">
                <i v-if="option === currentQuestion.correct" class="fas fa-check-circle"></i>
                <i v-else class="fas fa-times-circle"></i>
              </span>
            </div>
          </div>
          <transition name="fade">
            <div v-if="answerFeedback" class="feedback-message" :class="{ correct: answerFeedbackClass === 'correct', incorrect: answerFeedbackClass === 'incorrect' }">
              <p>{{ answerFeedback }}</p>
            </div>
          </transition>
        </div>

        <div v-else-if="currentQuestion.type === 'drag-drop'" class="drag-drop-box">
          <h2 class="question-text">{{ currentQuestion.text }}</h2>
          <div class="drag-options">
            <div
              v-for="(item, index) in currentQuestion.options"
            :key="index"
              draggable="true"
              @dragstart="dragStart(item)"
              class="draggable"
            >
              {{ item.text }}
            </div>
          </div>
          <div class="drop-zone" @dragover.prevent @drop="dropItem">
            <p v-if="!droppedItem">Drop Here</p>
            <p v-else :class="{ correct: droppedItem.correct, incorrect:!droppedItem.correct }">
              {{ droppedItem.text }}
            </p>
          </div>
          <transition name="fade">
            <div v-if="answerFeedback" class="feedback-message" :class="{ correct: answerFeedbackClass === 'correct', incorrect: answerFeedbackClass === 'incorrect' }">
              <p>{{ answerFeedback }}</p>
            </div>
          </transition>
        </div>
      </template>

      <template v-else>
        <div class="results">
          <h2 class="results-title">Quiz Completed!</h2>
          <p class="results-score">Your final score: {{ score }} / {{ questions.length }}</p>
          <button class="results-button" @click="restartQuiz">Try Again</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      questions: [
        {
          type: "multiple",
          text: "What is the capital of France?",
          options: ["Berlin", "Paris", "Rome", "Madrid"],
          correct: "Paris",
        },
        {
          type: "drag-drop",
          text: "Select the correct programming language used for web development.",
          options: [
            { text: "Python", correct: false },
            { text: "Swift", correct: false },
            { text: "JavaScript", correct: true },
            { text: "C++", correct: false },
          ],
        },
        {
          type: "multiple",
          text: "Which planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Venus"],
          correct: "Mars",
        },
        {
          type: "drag-drop",
          text: "Which of these is a primary color?",
          options: [
            { text: "Green", correct: false },
            { text: "Purple", correct: false },
            { text: "Red", correct: true },
            { text: "Orange", correct: false },
          ],
        },
        {
          type: "multiple",
          text: 'Who wrote "To Kill a Mockingbird"?',
          options: [
            "Harper Lee",
            "J.K. Rowling",
            "Ernest Hemingway",
            "Mark Twain",
          ],
          correct: "Harper Lee",
        },
        {
          type: "multiple",
          text: 'Which element has the chemical symbol "O"?',
          options: ["Oxygen", "Gold", "Osmium", "Iron"],
          correct: "Oxygen",
        },
        {
          type: "drag-drop",
          text: "Which country is known for the Great Wall?",
          options: [
            { text: "Japan", correct: false },
            { text: "India", correct: false },
            { text: "Russia", correct: false },
            { text: "China", correct: true },
          ],
        },
        {
          type: "multiple",
          text: "What year did World War II end?",
          options: ["1942", "1945", "1950", "1939"],
          correct: "1945",
        },
        {
          type: "drag-drop",
          text: "Identify the largest ocean on Earth.",
          options: [
            { text: "Pacific Ocean", correct: true },
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
          ],
        },
        {
          type: "drag-drop",
          text: "Which of these animals is a mammal?",
          options: [
            { text: "Frog", correct: false },
            { text: "Dolphin", correct: true },
            { text: "Shark", correct: false },
            { text: "Turtle", correct: false },
          ],
        },
      ],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      answerFeedback: '',
      answerFeedbackClass: '',
      droppedItem: null,
      score: 0,
      totalTime: 60,
      timeLeft: 60,
      timer: null,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    progressPercent() {
      return (this.timeLeft / this.totalTime) * 100;
    },
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.endQuiz();
        }
      }, 1000);
    },
    selectAnswer(option) {
      this.selectedAnswer = option;
      if (option === this.currentQuestion.correct) {
        this.score++;
        this.showFeedback('Correct!', 'correct');
        setTimeout(this.nextQuestion, 1000);
      } else {
        this.showFeedback('Incorrect! Try again.', 'incorrect');
      }
    },
    dragStart(item) {
      event.dataTransfer.setData('text', JSON.stringify(item));
    },
    dropItem(event) {
      const item = JSON.parse(event.dataTransfer.getData('text'));
      this.droppedItem = item;
      if (item.correct) {
        this.score++;
        this.showFeedback('Correct!', 'correct');
        setTimeout(this.nextQuestion, 1000);
      } else {
        this.showFeedback('Incorrect! Try again.', 'incorrect');
      }
    },
    showFeedback(message, type) {
      this.answerFeedback = message;
      this.answerFeedbackClass = type;
    },
    nextQuestion() {
      this.selectedAnswer = null;
      this.answerFeedback = '';
      this.droppedItem = null;

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.endQuiz();
      }
    },
    endQuiz() {
      clearInterval(this.timer);
      Swal.fire({
        title: 'Quiz Completed!',
        text: `Your final score: ${this.score} / ${this.questions.length}`,
        icon: 'success',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#244731',
      }).then((result) => {
        if (result.isConfirmed) {
          this.restartQuiz();
        }
      });
    },
    restartQuiz() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.timeLeft = this.totalTime;
      this.selectedAnswer = null;
      this.answerFeedback = '';
      this.droppedItem = null;
      this.startTimer();
    },
  },
  mounted() {
    this.startTimer();
  },
};
</script>

<style scoped>
/* General Styling */.quiz-container {
  background-color: #121212; /* Darker background */
  color: #ffffff;
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4);
  font-family: 'Poppins', sans-serif; /* Modern font */
  position: relative; /* For positioning feedback message */
}.quiz-content {
  background-color: #1f1f1f;
  padding: 30px;
  border-radius: 10px;
  position: relative; /* For positioning feedback message */
}.quiz-title {
  font-size: 2.2em;
  color: #f0f0f0; /* Off-white title */
  margin-bottom: 20px;
  text-align: center;
}

/* Timer and Progress Bar */.timer-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}.timer {
  font-size: 1em;
  color: #ffffff;
  margin-right: 15px;
}.progress-bar {
  width: 150px;
  height: 10px;
  background-color: #444c56;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0; /* Prevent progress bar from shrinking */
}.progress-fill {
  height: 100%;
  background-color: #80ed99; /* Green progress bar */
  transition: width 0.5s ease-in-out;
}

/* Question Styles */.question-box,.drag-drop-box {
  background-color: #282c34;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}.question-box:hover,.drag-drop-box:hover {
  transform: translateY(-3px); /* Subtle hover effect */
}.question-text {
  font-size: 1.6em;
  color: #ffffff;
  margin-bottom: 20px;
}

/* Multiple Choice Options */.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}.option-container {
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 10px;
  position: relative; /* To position the icon */
  transition: all 0.3s ease;
}.option-container button {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  flex-grow: 1; /* Allow button to take up available space */
}.option-container:hover {
  background-color: #383e48;
}.option-container.selected {
  border-color: #61dafb; /* Highlight with border color */
}.option-container.correct {
  border-color: #34d399;
}.option-container.incorrect {
  border-color: #f87171;
}.icon {
  position: absolute;
  right: 10px;
  font-size: 1.5em;
}.fa-check-circle {
  color: #34d399;
}.fa-times-circle {
  color: #f87171;
}.feedback-message {
  margin-top: 15px;
  font-size: 1.1em;
  font-weight: bold;
  text-align: center;
  padding: 8px 15px;
  border-radius: 5px;
  color: white; /* Ensure white text color for contrast */
}.feedback-message.correct {
  background-color: #34d399;
}.feedback-message.incorrect {
  background-color: #f87171;
}

/* Drag and Drop Styles */.drag-options {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}.draggable {
  background-color: #444c56;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: grab;
  text-align: center;
  font-size: 1em;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}.draggable:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}.drop-zone {
  background-color: #333945;
  border: 2px dashed #ffffff;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  font-size: 1em;
  min-height: 40px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}.drop-zone:hover {
  background-color: #444c56;
  border-color: #61dafb;
}.drop-zone.correct {
  background-color: #34d399;
  border-color: #34d399;
}.drop-zone.incorrect {
  background-color: #f87171;
  border-color: #f87171;
}.fade-enter-active,.fade-leave-active {
  transition: opacity 0.3s ease;
}.fade-enter,.fade-leave-to {
  opacity: 0;
}

/* Results Screen */.results {
  text-align: center;
  margin-top: 30px;
}.results-title {
  font-size: 2em;
  color: #f0f0f0;
  margin-bottom: 10px;
}.results-score {
  font-size: 1.5em;
  margin-bottom: 20px;
}.results-button {
  background-color: #80ed99; /* Green button */
  color: #121212;
  border: none;
  padding: 10px 20px;
  font-size: 1.2em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}.results-button:hover {
  background-color: #61c279;
}
</style>