<template>
  <div id="app" class="wrapper py-2 px-3">
    <sidebar v-bind:title="title"></sidebar>
    <timeline></timeline>
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


<style scoped>
.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
}
</style>