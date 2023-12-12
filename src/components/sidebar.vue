<template>
  <div class="px-2 py-2">
    <h2>{{ title }}</h2>

    <b-container id="chart-selector" class="my-2">
      <b-row align-v="center">
        <b-col>
          <h4>Toggle Chart</h4>
        </b-col>
        <b-col class="pr-0">
          <h6>Timeline</h6>
        </b-col>
        <b-col class="px-0">
          <b-form-checkbox
            v-model="showComponent"
            switch
            value="map"
            unchecked-value="timeline"
            v-on:change="toggleComponentShown"
          ></b-form-checkbox>
        </b-col>
        <b-col class="pl-0">
          <h6 class="ml-2">Map</h6>
        </b-col>
      </b-row>
    </b-container>
    <p>
      The data for this project comes from
      <a href="https://history.house.gov">history.house.gov</a>, which provides
      historical data on minority groups serving in congress, including Black
      Americans, Women, Hispanic Americans, and Asian/Pacific Islander
      Americans.
    </p>
    <p>
      The inspiration for this site came about while a friend and I were reading
      Ibram X. Kendi's
      <a href="https://www.ibramxkendi.com/stamped">
        Stamped from the Beginning: The Definitive History of Racist Ideas in
        America</a
      >.
    </p>
    <p>
      With this site, I wanted to visualize the Reconstruction Era, and the
      years directly following it, when Black Americans were first able to
      participate in politics, and were then later often denied access through
      poll taxes & voting literacy tests.
    </p>
    <p>
      This history is important to visualize and understand, as it runs counter
      to the pervasive idea that institutional racism, and perhaps racism in
      general, has been continuously improving in our country.
    </p>
    <p>
      I was also interested in answering other questions: When did the majority
      of Black American politicians switch from the Republican to Democratic
      party? And which states have sent the most Black/Female/Hispanic/and AAPI
      Americans to the House?
    </p>
    <p>
      Data for this site was collected in October 2020, and this site currently
      displays only data from the 50 US States for politicians serving in the US
      House of Representatives (not the Senate).
    </p>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  data() {
    return {
      showComponent: "timeline",
    };
  },
  props: { title: String },
  methods: {
    toggleComponentShown() {
      this.$emit("change-component", this.showComponent);
    },
  },
};
</script>

<style scoped></style>
