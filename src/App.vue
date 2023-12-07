<template>
  <div id="app" class="wrapper">
    <div class="sidebar" v-bind:class="{ active: showSidebar }">
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
    <!-- If showing sidebar, push chart Options to the Right -->
    <timeline v-bind:pushChartOptionsRight="showSidebar"></timeline>
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
      showSidebar: false,
      windowWidth: window.innerWidth,
    };
  },
  watch: {
    windowWidth(newWidth, oldWidth) {
      // Only show sidebar if page is wide
      this.showSidebar = newWidth > 1000;
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    collapseSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    onResize() {
      this.windowWidth = window.innerWidth;
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
  background-color: lightsteelblue;
  margin-left: -375px;
}

.sidebar.active {
  margin-left: 0;
}

/* The following media query is buggy in that it does the opposite of desired functionality when closing the Sidebar, then making the screen less small. Use watcher and nextTick() instead */
/* @media (max-width: 1000px) {
  .sidebar.active {
    margin-left: -375px;
  }
  .sidebar {
    margin-left: 0;
  }
} */

.toggle-button {
  background-color: lightsteelblue;
  border-radius: 0 0 10px 0;
}

.toggle-button button {
  max-width: 80px;
}
</style>
