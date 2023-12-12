<template>
  <b-container fluid>
    <minority-group-selector v-on:group-changed="renderMap">
    </minority-group-selector>
    <b-row class="map-options pt-4"> </b-row>
    <svg></svg>
  </b-container>
</template>

<script>
import { feature } from "topojson-client";
import d3 from "./../d3Importer";
import MinorityGroupSelector from "./MinorityGroupSelector.vue";
import filter from "./../filter";
import { tickFormat } from "d3-scale";

export default {
  name: "UsaStatesMap",
  components: { MinorityGroupSelector },
  data() {
    return {
      filtersList: [filter.houseOnly, filter.statesOnly],
    };
  },
  props: {
    completeDataSet: Array,
  },
  mounted() {
    this.renderMap("Black");
  },
  methods: {
    applyGenericFilters(data) {
      this.filtersList.forEach((filterFn) => {
        data = filterFn(data);
      });
      return data;
    },
    filterByMinorityGroup(data, group) {
      return filter.bySelectedGroup(group, data);
    },
    renderMap(chosenGroup) {
      // Process Congress Data : apply generic and chosenGroup filters
      const congressData = this.filterByMinorityGroup(
        this.applyGenericFilters(this.completeDataSet),
        chosenGroup
      );

      // Process Congress Data : map { state-abbrev : list of people in that group (and state) throughout history }
      const peoplePerGroupPerState = congressData.reduce((accumulator, row) => {
        if (!accumulator[row.StateOrTerritory]) {
          accumulator[row.StateOrTerritory] = [];
        }
        accumulator[row.StateOrTerritory].push(row);
        return accumulator;
      }, {});

      const states_hash = {
        Alabama: "AL",
        Alaska: "AK",
        Arizona: "AZ",
        Arkansas: "AR",
        California: "CA",
        Colorado: "CO",
        Connecticut: "CT",
        Delaware: "DE",
        Florida: "FL",
        Georgia: "GA",
        Hawaii: "HI",
        Idaho: "ID",
        Illinois: "IL",
        Indiana: "IN",
        Iowa: "IA",
        Kansas: "KS",
        Kentucky: "KY",
        Louisiana: "LA",
        Maine: "ME",
        Maryland: "MD",
        Massachusetts: "MA",
        Michigan: "MI",
        Minnesota: "MN",
        Mississippi: "MS",
        Missouri: "MO",
        Montana: "MT",
        Nebraska: "NE",
        Nevada: "NV",
        "New Hampshire": "NH",
        "New Jersey": "NJ",
        "New Mexico": "NM",
        "New York": "NY",
        "North Carolina": "NC",
        "North Dakota": "ND",
        Ohio: "OH",
        Oklahoma: "OK",
        Oregon: "OR",
        Pennsylvania: "PA",
        "Rhode Island": "RI",
        "South Carolina": "SC",
        "South Dakota": "SD",
        Tennessee: "TN",
        Texas: "TX",
        Utah: "UT",
        Vermont: "VT",
        Virginia: "VA",
        Washington: "WA",
        "West Virginia": "WV",
        Wisconsin: "WI",
        Wyoming: "WY",
      };

      // Start processing svg
      // svg setup
      const margin = { top: 30, right: 10, bottom: 30, left: 35 };
      const svgWidth = 950;
      const svgHeight = 650;

      const svg = d3
        .select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      // Cleanup any existing svg's
      svg.select("#map").remove();
      svg.select("#legend").remove();

      const statePathsG = svg.append("g").attr("id", "map");

      const colorLegendG = svg
        .append("g")
        .attr("id", "legend")
        .attr("transform", "translate(450, 500)");

      const projection = d3.geoAlbersUsa();
      const pathGenerator = d3.geoPath().projection(projection);

      d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(
        (geoStatesData) => {
          const states = feature(geoStatesData, geoStatesData.objects.states) // convert data from topojson to geojson
            .features.filter((row) => {
              // only keep 50 official states
              return row.properties.name in states_hash;
            });

          // merge states with peoplePerGroupPerState
          states.forEach((row) => {
            row.properties.congressData = {};
            Object.assign(
              row.properties.congressData,
              peoplePerGroupPerState[states_hash[row.properties.name]]
            );
          });

          // setup for chloropleth
          const colorValue = (d) =>
            Object.keys(d.properties.congressData).length;
          // setup for domain
          const maxNumberOfCongressMembers = Math.max(
            ...states.map(colorValue)
          );
          // set up color scale
          const colorScale = d3
            .scaleSequential()
            .domain([0, maxNumberOfCongressMembers])
            .range(["honeydew", "forestgreen"]);

          statePathsG
            .selectAll("path")
            .data(states)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", (d) => pathGenerator(d))
            .attr("fill", (d) => colorScale(colorValue(d)))
            .append("title")
            .text(
              (d) =>
                d.properties.name +
                ": " +
                Object.keys(d.properties.congressData).length
            );

          colorLegendG.append(() =>
            this.generateColorLegend(colorScale, {
              title: `Number of ${chosenGroup} Americans serving in Congress between 1821 - 2019`,
            })
          );
        }
      );
    },
    ramp(color, n = 256) {
      const canvas = document.createElement("canvas");
      canvas.width = n;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
      return canvas;
    },
    generateColorLegend(
      colorScale,
      {
        title,
        tickSize = 6,
        width = 360,
        height = 44 + tickSize,
        marginTop = 18,
        marginRight = 0,
        marginBottom = 16 + tickSize,
        marginLeft = 0,
        ticks = width / 32,
        tickFormat,
        tickValues,
      } = {}
    ) {
      const legendSvg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

      let tickAdjust = (g) =>
        g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);

      const ticksScale = Object.assign(
        colorScale
          .copy()
          .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
        {
          range() {
            return [marginLeft, width - marginRight];
          },
        }
      );

      legendSvg
        .append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", this.ramp(colorScale.interpolator()).toDataURL());

      legendSvg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(
          d3
            .axisBottom(ticksScale)
            .ticks(
              ticks,
              typeof tickFormat === "string" ? tickFormat : undefined
            )
            .tickFormat(
              typeof tickFormat === "function" ? tickFormat : undefined
            )
            .tickSize(tickSize)
            .tickValues(tickValues)
        )
        .call(tickAdjust)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("class", "title")
            .text(title)
        );

      return legendSvg.node();
    },
  },
};
</script>

<style>
.state {
  /* fill: green; */
  stroke: black;
  stroke-opacity: 0.3;
}

.state:hover {
  fill: pink;
}
</style>
