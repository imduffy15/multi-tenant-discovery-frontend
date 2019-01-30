<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">Mutli Tenant Manager</span>
      </v-toolbar-title>
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
export default {
  name: "App"
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
