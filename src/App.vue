<template>
  <div id="app">
    <h2>
      {{ title }}
    </h2>
    <router-view></router-view>
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
