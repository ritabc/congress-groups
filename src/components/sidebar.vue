<template>
  <div>
    <b-navbar>
      <b-navbar-nav class="ml-auto">
        <b-button
          id="sidebarCollapse"
          variant="info"
          v-on:click="collapseSidebar()"
          >Toggle Sidebar</b-button
        >
      </b-navbar-nav>
    </b-navbar>
    <div class="sidebar" v-bind:class="{ active: isActive }">
      <h2>{{ title }}</h2>
      <p>
        The inspiration for this site came about while a friend and I were
        reading Ibram X. Kendi's
        <a href="https://www.ibramxkendi.com/stamped">
          Stamped from the Beginning: The Definitive History of Racist Ideas in
          America</a
        >.
      </p>
      <p>
        While reading this book, we came across many gaps in our grade school
        education which were filled by informative historical facts from this
        book. In particular, I remember learning in social studies classes that
        the horrific period of slavery was followed by the less horrible periods
        of sharecropping. However, I learned nothing (or remember learning
        nothing) of the Reconstruction era and the 15 or so years following it,
        when Black Americans in the South voted and held political office at
        much higher rates than in the first 50+ years of the 20th century.
      </p>
      <p>
        With the creation of this site, I attempt to visualize this period when
        Black Americans were able to participate in politics, and then were
        later denied access through poll taxes & voting literacy tests.
      </p>
      <p>
        This history is important to visualize and understand, as it runs
        counter to the popular idea that Black/White race relations are
        continuosly improving in our country. The fact that lynchings reached
        their height at the beginning of the 20th century, long after this
        period of Black political activity, is just one example of many to the
        contrary.
      </p>
      <p>
        Another motivation for this site was to answer the question: When did
        the majority of Black American politicians switch from the Republican to
        Democratic party? I hope to soon add a feature to show the answer
        visually. In addition, I plan to add events to the timeline, as well as
        hoverable tooltips displaying information on each Congress person.
      </p>
      <h6>About The Data</h6>
      <p>
        The data for this project comes from
        <a href="history.house.gov">history.house.gov</a>, which also provides
        historical data on Women, Hispanic Americans, and Asian/Pacific Islander
        Americans serving in Congress. I hope it's informative to visualize when
        and how many members of these groups served in Congress as well.
      </p>
      <p>
        Note that a snapshot of the data was taken in October 2020, and this
        site currently displays only data from the 50 US States for politicians
        serving in the US House of Representatives (not the Senate).
      </p>
    </div>
    <!-- </b-sidebar> -->
  </div>
</template>

<script>
export default {
  name: "sidebar",
  props: { title: String },
  data() {
    return {
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

<style scoped>
.sidebar {
  min-width: 375px;
  max-width: 375px;
  min-height: 100vh;
}

.sidebar.active {
  margin-left: -400px;
}
</style>