import Vue from "vue";
import Router from "vue-router";
import { vuexOidcCreateRouterMiddleware } from "vuex-oidc";

import store from "@/store";
import Root from "./views/Root.vue";
import Create from "./views/Create.vue";
import Callback from "./views/Callback.vue";
import Find from "./views/Find.vue";

Vue.use(Router);

var router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "root",
      component: Root,
      meta: {
        isPublic: true
      }
    },
    {
      path: "/create",
      name: "create",
      component: Create
    },
    {
      path: "/find",
      name: "find",
      component: Find
    },
    {
      path: "/oidc-callback", // Needs to match redirect_uri in you oidcSettings
      name: "oidcCallback",
      component: Callback,
      meta: {
        isVuexOidcCallback: true,
        isPublic: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  vuexOidcCreateRouterMiddleware(store)(to, from, next);
});

export default router;
