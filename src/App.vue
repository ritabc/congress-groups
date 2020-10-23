<template>
  <div id="app" class="wrapper">
    <div class="sidebar" v-bind:class="{ active: isActive }">
      <sidebar v-bind:title="title"></sidebar>
    </div>
    <div>
      <b-navbar class="toggle-button">
        <b-navbar-nav class="ml-auto">
          <b-button variant="info" v-on:click="collapseSidebar()"
            >Toggle Sidebar</b-button
          >
        </b-navbar-nav>
      </b-navbar>
    </div>
    <b-container>
      <timeline></timeline>
    </b-container>
  </div>
</template>

<script>
import sidebar from "./components/sidebar";
import timeline from "./components/timeline";

export default {
  name: "app",
  components: {
    sidebar,
    timeline,
  },
  data() {
    return {
      title: "Minority Groups In Congresss",
      isActive: false,
    };
  },
  methods: {
    collapseSidebar() {
      this.isActive = !this.isActive;
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
</style>


<style scoped>
.wrapper {
  display: flex;
  width: 98%;
  align-items: stretch;
}
.sidebar {
  min-width: 375px;
  max-width: 375px;
  min-height: 100vh;
  background-color: #d4f7f9;
}

.sidebar.active {
  margin-left: -375px;
}

@media (max-width: 1000px) {
  .sidebar {
    margin-left: -375px;
  }
  .sidebar.active {
    margin-left: 0;
  }
}
.toggle-button {
  background-color: #d4f7f9;
  border-radius: 0 0 10px 0;
}

.toggle-button button {
  max-width: 80px;
}
</style>