<template>
  <div>
    <div class="my-3" v-if="notFound">
      <v-alert :value="true" type="info">{{notFound}}</v-alert>
    </div>
    <v-card>
      <v-form ref="form" v-model="valid">
        <v-card-title primary-title>
          <div>
            <div class="headline">Sign in to your tenant</div>
            <span class="grey--text">Enter your tenant's URL.</span>
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="tenant"
            label="Tenant"
            :single-line="true"
            :suffix="'.' + hostname"
            outline
            required
            :rules="tenantRules"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-layout column>
          <v-btn
            :loading="loading"
            :disabled="!valid || loading"
            @click="submit"
            block
            depressed
            color="primary"
          >Sign In</v-btn>
          <div class="ma-4 text-xs-center title font-weight-light grey--text">Don't know your tenant URL? <router-link to="find">Find your tenant URL</router-link></div>
          </v-layout>
        </v-card-actions>
      </v-form>
    </v-card>
    <div class="ma-4 text-xs-center title font-weight-light"><router-link to="create">Create a new tenant</router-link></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => {
    return {
      loading: false,
      valid: false,
      tenant: "",
      tenantRules: [
        v => !!v || "Tenant is required",
        v => (v && v.length <= 63) || "Tenant must be less than 63 characters",
        v => (v && !/\s/.test(v)) || "Tenant must contain no spaces",
        v =>
          (v && new RegExp("[A-Za-z0-9]+").test(v)) ||
          "Tenant must be a valid subdomain"
      ],
      notFound: null
    };
  },
  computed: {
    hostname: () => {
      return window.location.hostname;
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios
          .get(
            "/auth/realms/" + this.tenant + "/.well-known/openid-configuration"
          )
          .then(() => {
            window.location = "//" + this.tenant + "." + this.hostname;
          })
          .catch(() => {
            this.notFound = this.tenant + " does not exist";
            this.loading = false;
          });
      }
    }
  }
};
</script>
