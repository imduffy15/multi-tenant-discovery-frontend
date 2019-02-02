<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">Tenant Manager</span>
      </v-toolbar-title>
      <v-spacer />
        <div
          class="mt-auto mb-auto pl-4"
          style="display: inline-flex; height: 100%;">
          <div class="mt-auto mb-auto">
            <v-btn
              v-if="oidcIsAuthenticated"
              small
              depressed
              color="secondary"
              @click="signOutOidc">
              <v-icon
                left
                small>
                account_box
              </v-icon>
                            {{ oidcUser && oidcUser.user_name }}
            </v-btn>

            <v-btn
              v-else
              small
              depressed
              color="secondary"
              @click="authenticateOidc">
              <v-icon
                left
                small>
                account_box
              </v-icon>
              Login
            </v-btn>
          </div>
        </div>

    </v-toolbar>
    <v-slide-y-transition mode="out-in">
      <v-content class="mb-5">
        <v-container>
          <v-layout column>
            <router-view />
          </v-layout>
        </v-container>
      </v-content>
    </v-slide-y-transition>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters(["oidcIsAuthenticated", "oidcUser"])
  },
  methods: {
    ...mapActions(["signOutOidc"]),
    ...mapActions(["authenticateOidc"])
  }
};
</script>

<style>
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
* {
  word-break: break-all;
  white-space: normal;
}
</style>
