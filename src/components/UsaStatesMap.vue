<template>
  <b-container fluid>
    <b-row class="map-header py-2">
      <b-col offset-lg="3" lg="7"> </b-col>
    </b-row>
    <b-row class="map-options pt-4"> </b-row>
    <div id="map" class="svg-container"></div>
    <svg></svg>
  </b-container>
</template>

<script>
import { feature } from "topojson-client";
import d3 from "./../d3Importer";

export default {
  name: "UsaStatesMap",
  data() {
    return {};
  },
  mounted() {
    this.renderMap();
  },
  methods: {
    renderMap() {
      // Cleanup any existing svg's
      d3.selectAll(".graph").remove();

      // svg setup
      const margin = { top: 30, right: 10, bottom: 30, left: 35 };
      const svgWidth = 850;
      const svgHeight = 650;
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;

      const svg = d3
        .select("#map")
        .append("svg")
        .attr("class", "graph")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
      const projection = d3.geoAlbersUsa();
      const pathGenerator = d3.geoPath().projection(projection);
      d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(
        (data) => {
          // convert data from topojson to geojson
          const states = feature(data, data.objects.states);
          svg
            .selectAll("path")
            .data(states.features)
            .enter()
            .append("path")
            .attr("d", (d) => pathGenerator(d));
        }
      );
    },
  },
};
</script>

<style scoped>
#map {
  fill: green;
  stroke: black;
  stroke-opacity: 0.3;
}
</style>
