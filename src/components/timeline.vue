<template>
  <div>
    <div>
      <p
        class="congress"
        v-bind:key="(congress, index)"
        v-for="(congress, index) in congressAndYearRange"
      >
        <span v-if="index % 3 == 0">
          {{ congress }}
        </span>
      </p>
    </div>
    <div id="timeline"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "timeline",
  props: ["congressMembersData"],
  data() {
    return {
      msg: "Message in Timeline",
    };
  },
  mounted() {
    this.generateTimeline();
  },
  computed: {
    congressAndYearRange: function () {
      let setOfCongressAndRange = new Set();
      this.congressMembersData.forEach((row) => {
        let s = `${row.Congress} (${row.SessionBegan} - ${row.SessionEnded})`;
        setOfCongressAndRange.add(s);
      });
      return setOfCongressAndRange;
    },
  },
  methods: {
    generateTimeline() {
      let tlScale = d3
        .scaleTime()
        .domain([this.earliestYear(), this.latestYear()])
        .range([0, 1000]);
      let tlAxis = d3.axisLeft(tlScale).ticks(30);
      const svg = d3
        .select("#timeline")
        .append("svg")
        .attr("width", 300)
        .attr("height", 1000);
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(30, 0)")
        .call(tlAxis);
    },
    earliestYear() {
      // TODO: Remove hard coding
      return new Date(1853, 0, 0, 0);
    },
    latestYear() {
      // TODO: Remove hard coding
      return new Date(2021, 0, 0, 0);
    },
  },
};
</script>

<style scoped>
p.congress {
  margin: 0%;
  font-size: 0.8em;
}
</style>