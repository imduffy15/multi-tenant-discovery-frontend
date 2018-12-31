<template>
  <section>
    <v-layout row class="my-5">
      <v-spacer></v-spacer>
      <v-layout column>
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
                suffix=".ianduffy.ie"
                outline
                required
                :rules="tenantRules"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :loading="loading"
                :disabled="!valid || loading"
                @click="submit"
                block
                depressed
                color="primary"
              >Continue</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-layout>
      <v-spacer></v-spacer>
    </v-layout>
  </section>
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
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios
          .get(
            "/auth/realms/" + this.tenant + "/.well-known/openid-configuration"
          )
          .then(() => {
            window.location = "http://" + this.tenant + ".ianduffy.ie";
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
