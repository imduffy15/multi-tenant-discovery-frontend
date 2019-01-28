<template>
  <div>
    <v-card v-if="completed">
      <v-card-title primary-title>
        <div>
          <div class="headline">Your tenant has been created successfully</div>
        </div>
      </v-card-title>
      <v-card-text>
        Thank you for signing up, your tenant is available at
        <a :href="loginUrl()">{{ loginUrl() }}</a>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-form ref="form" v-model="valid">
        <v-card-title primary-title>
          <div>
            <div class="headline">Create a new tenant</div>
            <span class="grey--text"
              >Fill out the information below to create a new tenant</span
            >
          </div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.tenant"
            label="Tenant"
            :single-line="true"
            :suffix="'.' + hostname"
            outline
            required
            :rules="tenantRules"
          ></v-text-field>
          <v-text-field
            v-model="form.first_name"
            label="Firstname"
            placeholder="Homer"
            outline
            required
            :rules="firstnameRules"
          ></v-text-field>
          <v-text-field
            v-model="form.last_name"
            label="Lastname"
            placeholder="Simpson"
            outline
            required
            :rules="lastnameRules"
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="homer.simpson@globex.com"
            outline
            required
            :rules="emailRules"
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            label="Password"
            type="password"
            outline
            required
            :rules="passwordRules"
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
            >Create</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
    <div class="ma-4 text-xs-center title font-weight-light">
      <router-link to="/">Looking for an existing tenant?</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  beforeMount: () => {
    console.log("", window.location.host);
  },
  data: () => {
    return {
      loading: false,
      valid: false,
      form: {},
      tenantRules: [
        v => !!v || "Tenant is required",
        v => (v && v.length <= 63) || "Tenant must be less than 63 characters",
        v => (v && !/\s/.test(v)) || "Tenant must contain no spaces",
        v =>
          (v && new RegExp("[A-Za-z0-9]+").test(v)) ||
          "Tenant must be a valid subdomain"
      ],
      firstnameRules: [v => !!v || "Firstname is required"],
      lastnameRules: [v => !!v || "Lastname is required"],
      emailRules: [
        v => !!v || "Email is required",
        v =>
          (v &&
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            )) ||
          "Email must be a valid email"
      ],
      passwordRules: [v => !!v || "Password is required"],
      notFound: null,
      completed: false
    };
  },
  computed: {
    hostname: () => {
      return window.location.host;
    },
    protocol: () => {
      return window.location.protocol;
    }
  },
  methods: {
    loginUrl() {
      return this.protocol + "//" + this.form.tenant + "." + this.hostname;
    },
    submit() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        axios
          .post("/api/tenant", {
            ...this.form,
            origin: this.hostname,
            protocol: this.protocol
          })
          // eslint-disable-next-line no-unused-vars
          .then(result => {
            console.log(result.data);

            for (var cookie of result.data.cookies) {
              console.log("Setting cookie " + cookie);
              document.cookie = cookie;
            }

            this.completed = true;
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      }
    }
  }
};
</script>
