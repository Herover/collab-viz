import { createRouter, createWebHistory } from "vue-router";
import VegaEditorView from "../views/VegaEditorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/1",
      name: "1",
      component: VegaEditorView,
    },
    {
      path: "/2/:id/:subpage?",
      name: "2",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/FancyEditorView.vue"),
    },
  ],
});

export default router;
