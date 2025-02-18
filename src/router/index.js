import { createRouter, createWebHistory } from "vue-router";
import QuizPage from "../views/QuizPage.vue";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: QuizPage,
    },
  ],
});

export default router;
