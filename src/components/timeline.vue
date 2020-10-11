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
    this.generateSVG();
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
    generateSVG() {
      let tlScale = d3
        .scaleTime()
        .domain([this.earliestYear(), this.latestYear()])
        .range([0, 850]); // corresponds to height - 2nd value must be less than height (850 currently)
      let tlAxis = d3.axisLeft(tlScale).ticks(15); // Can change to ticks every 5 years by ".ticks(30)"
      const svg = d3
        .select("#timeline")
        .append("svg")
        .attr("width", 300)
        .attr("height", 850);
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(30, 0)")
        .call(tlAxis);
      svg
        .selectAll("circle")
        .data(this.congressMembersData)
        .enter()
        .append("circle")
        .attr("cy", (d) => {
          // If works, will display dot for each congressMember, across all groups
          return tlScale(new Date(parseInt(d.SessionBegan), 0, 0, 0));
        })
        .attr("cx", 50)
        .attr("r", 5);
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