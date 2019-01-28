import Vue from "vue";
import Router from "vue-router";
import Root from "./views/Root.vue";
import Create from "./views/Create.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "root",
      component: Root
    },
    {
      path: "/create",
      name: "create",
      component: Create
    }
  ]
});
