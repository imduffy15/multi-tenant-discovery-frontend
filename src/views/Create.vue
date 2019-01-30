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
          <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <img :src="imageUrl" height="150" v-if="imageUrl"/>
            <v-text-field label="Select your logo" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
            <input
              type="file"
              style="display: none"
              ref="image"
              accept="image/png, image/jpeg, image/svg+xml"
              @change="onFileChanged"
            >
          </v-flex>
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
    console.log("", window.location);
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
          (v && new RegExp("[a-z0-9]+").test(v)) ||
          "Tenant must be a valid subdomain made up of lower case letters and numbers"
      ],
      passwordRules: [v => !!v || "Password is required"],
      notFound: null,
      completed: false,
      imageName: "",
      imageUrl: "",
      imageFile: ""
    };
  },
  computed: {
    hostname: () => {
      return window.location.hostname;
    },
    protocol: () => {
      return window.location.protocol;
    }
  },
  methods: {
    loginUrl() {
      return this.protocol + "//" + this.form.tenant + "." + this.hostname;
    },
    pickFile() {
      this.$refs.image.click();
    },
    onFileChanged(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0];
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    submit() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        axios
          .post("/api/tenant", this.form)
          .then(result => {
            axios
              .put(
                "/api/tenant/" + result.data.tenant + "/logo",
                this.imageFile,
                {
                  headers: {
                    "Content-Type": "image/png"
                  }
                }
              )
              // eslint-disable-next-line no-unused-vars
              .then(result => {
                this.completed = true;
                this.loading = false;
              });

            for (var cookie of result.data.cookies) {
              console.log("Setting cookie " + cookie);
              document.cookie = cookie;
            }
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
