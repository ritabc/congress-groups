<template>
  <div id="app">
    <h2>
      {{ title }}
    </h2>
    <div v-if="dataReady">
      <timeline :congressMembersData="congressMembersData"></timeline>
    </div>
  </div>
</template>

<script>
import timeline from "./components/timeline";

import * as d3 from "d3";
export default {
  components: {
    timeline,
  },
  data() {
    return {
      title: "Minority Groups In Congresss",
      congressMembersData: {},
      dataReady: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let data = await d3.csv("./data/minorityGroupCongressMembers.csv");
      this.congressMembersData = data;
      this.dataReady = true;
    },
  },
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
