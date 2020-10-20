<template>
  <div id="app">
    <b-container class="pt-3">
      <h3>{{ title }}</h3>
      <sidebar></sidebar>
      <timeline></timeline>
    </b-container>
  </div>
</template>

<script>
import sidebar from "./components/sidebar";
import timeline from "./components/timeline";

export default {
  components: {
    sidebar,
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
</style>
