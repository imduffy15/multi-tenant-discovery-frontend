<template>
  <div>
    <v-card>
        <v-card-title primary-title>
          <div>
            <div class="headline">Your tenants</div>
            <span class="grey--text"
              >You are a member of these tenants</span
            >
          </div>
        </v-card-title>
        <v-container>
          <v-layout row wrap justify-space-between>
            <v-flex
              v-for="tenant in tenants"
              :key="tenant.tenant"
              xs12
              lg5
              class="ma-2"
            >
              <v-card flat color="grey lighten-4" class="px-2 ma-0">
                <v-layout align-center="" align-content-space-around="">
                  <v-flex xs2>
                      <v-img 
                        :src="'/api/tenant/' + tenant.tenant + '/logo'"
                        contain
                        min-height="96px"
                        max-height="96px"
                      />
                  </v-flex>
                  <v-flex xs7>
                    <v-card-title>
                      <div>
                        <div class="font-weight-light">{{tenant.display_name}}</div>
                      </div>
                    </v-card-title>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn @click="impersonate(tenant.tenant)" depressed outline block color="primary">Launch</v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  beforeMount() {
    axios.get("/api/tenant").then(result => {
      this.tenants = result.data;
    });
  },
  data: () => {
    return {
      tenants: []
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
    impersonate(tenant) {
      axios
        .post("/api/tenant/impersonate?tenant=" + tenant, {})
        .then(result => {
          for (var cookie of result.data.cookies) {
            document.cookie = cookie;
          }
          window.location.href =
            this.protocol + "//" + tenant + "." + this.hostname;
        });
    }
  }
};
</script>
