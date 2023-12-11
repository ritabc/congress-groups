<template>
  <b-container fluid>
    <b-row class="tl-header py-2">
      <b-col offset-lg="3" lg="7">
        <minority-group-selector
          v-on:group-changed="filterDataRerender"
        ></minority-group-selector>
      </b-col>
    </b-row>
    <b-row
      class="chart-options pt-4"
      v-bind:class="{ pushOver: pushChartOptionsRight }"
    >
      <b-col>
        <b-form-checkbox
          id="party-checkbox"
          class="my-2"
          name="party-checkbox"
          v-bind:showParty="false"
          v-on:change="updateShowPartyRerender"
          >Show Distinction By Party</b-form-checkbox
        >
        <div v-if="showParty" id="party-legend">
          <svg id="partyLegend" width="200" height="100">
            <circle
              r="6"
              v-bind:style="{ fill: republican }"
              cx="50"
              cy="25"
            ></circle>
            <text x="65" y="30">Repbulican</text>
            <circle
              r="6"
              v-bind:style="{ fill: democrat }"
              cx="50"
              cy="50"
            ></circle>
            <text x="65" y="55">Democrat</text>
            <circle
              r="6"
              v-bind:style="{ fill: otherParty }"
              cx="50"
              cy="75"
            ></circle>
            <text x="65" y="80">Another Party</text>
          </svg>
        </div>
      </b-col>
    </b-row>
    <div id="timeline" class="svg-container"></div>
  </b-container>
</template>

<script>
import d3 from "./../d3Importer";
import filter from "../filter";
import MinorityGroupSelector from "./MinorityGroupSelector.vue";
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.24;

export default {
  name: "timeline",
  components: {
    MinorityGroupSelector,
  },
  data() {
    return {
      msg: "Message in Timeline",
      filteredData: {},
      showParty: false,
      republican: "#cc0000",
      democrat: "#4e4eff",
      otherParty: "#FF00FF",
    };
  },
  props: {
    pushChartOptionsRight: Boolean,
    completeDataSet: Array,
  },
  mounted() {
    this.filterDataRerender("Black");
  },
  computed: {
    dataGroupedBySession: function() {
      // transform data from:
      // [{congress: 56, yearRange: (1985-1938), person: ABC...}, {congress: 56, yearRange: (1985-1938), person: DEF...} ]
      // to
      // [{congres: 56, yearRange: (1985-1938), people: [ABC, DEF...],...}}]
      let bySession = [];
      this.filteredData.forEach((row) => {
        if (bySession.some((c) => c.Congress === row.Congress)) {
          // We already have that congress in bySession
          let relevantCongress = bySession.find((c) => {
            return c.Congress === row.Congress;
          });
          relevantCongress.Members.push({
            LastName: row.LastName,
            FirstMiddleName: row.FirstMiddleName,
            url: row.url,
            StateOrTerritory: row.StateOrTerritory,
            Party: row.Party,
            Service: row.Service,
            MinorityGroup: row.MinorityGroup,
          });
        } else {
          // If bySession doesn't have that congress yet
          bySession.push({
            Congress: row.Congress,
            YearRange: row.YearRange,
            SessionBegan: row.SessionBegan,
            SessionEnded: row.SessionEnded,
            Members: [
              {
                LastName: row.LastName,
                FirstMiddleName: row.FirstMiddleName,
                url: row.url,
                StateOrTerritory: row.StateOrTerritory,
                Party: row.Party,
                Service: row.Service,
                MinorityGroup: row.MinorityGroup,
              },
            ],
          });
        }
      });
      return bySession;
    },
  },
  methods: {
    updateShowPartyRerender(event) {
      this.showParty = event;
      this.generateSVG(this.dataGroupedBySession);
    },
    filterDataRerender(group) {
      this.filteredData = filter.bySelectedGroup(
        group,
        filter.statesOnly(filter.houseOnly(this.completeDataSet))

        // Can also include territories by replacing the line above with this:
        // this.houseOnly(allData)
      );
      // compute dataGroupedBySession which will be based on this.filteredData
      this.generateSVG(this.dataGroupedBySession);
    },
    generateSVG(dataToUse) {
      // Remove any svg's with .chart that already exist
      d3.selectAll(".graph").remove();

      if (dataToUse.length === 0) {
        return;
      }

      const margin = { top: 30, right: 10, bottom: 30, left: 35 };
      const svgWidth = 650;
      const radius = 3;
      const svgHeight = this.completeSpan() * (radius + 2);
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;
      const oranges = ["#f0a150", "#f48020", "#c76706"];

      // Setup svg
      const svg = d3
        .select("#timeline")
        .append("svg")
        .attr("class", "graph")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("preserveAspectRatio", "xMinYMin meet");

      // Setup timeline scale and (y) axis
      let tlScale = d3
        .scaleTime()
        .domain([this.earliestYear(), this.latestYear()])
        .range([margin.top, margin.top + graphHeight]) // what values you want to pop out (y values)
        .nice();
      let tlAxis = d3.axisLeft(tlScale).ticks(15); // Can change to ticks every 5 years by ".ticks(30)"

      // Draw timeline axis
      svg
        .append("g")
        .attr("class", "timeline-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(tlAxis);

      // Setup x scale & axis
      let nScale = d3
        .scaleLinear()
        // .domain([0, this.maxPeoplePerCongress(dataToUse)])
        // Hard code to be the highest frequency of people in a single congress across all groups (women)
        // So that scale is the same across all groups
        .domain([0, 105])
        .range([margin.left, margin.left + graphWidth]);

      // Draw x axis
      // let nAxis = d3.axisBottom(nScale).ticks(10);
      // svg
      //   .append("g")
      //   .attr("class", "n-axis")
      //   .attr("transform", `translate(0, ${margin.top + graphHeight})`)
      //   .call(nAxis);

      // Add svg groups each with .congress-session
      let congressSessions = svg
        .selectAll(".congress-session")
        .data(dataToUse)
        .enter()
        .append("g")
        .attr("class", "congress-session");

      // To .congress-session, add a circle
      congressSessions
        .selectAll("circle")
        // d is each session's data (with congress info, year info, and list of members)
        .data((d) =>
          d.Members.sort(this.compareParty).map((member) => {
            return {
              congress: d.Congress,
              yearRange: d.YearRange,
              sessionBegan: d.SessionBegan,
              sessionEnded: d.SessionEnded,
              member: member,
            };
          })
        )
        .enter()
        .append("circle")
        .attr("cy", (d, i) => {
          return tlScale(new Date(parseInt(d.sessionBegan), 0, 0, 0));
        })
        .attr("cx", (d, i) => {
          // Add 2 so that dots aren't bumping against timeline axis
          return nScale(i) + 2;
        })
        .attr("r", radius - 0.5) // Subtract 0.5 to decrease the amount that dots run together
        .style("fill", (d, i) => {
          if (this.showParty) {
            if (d.member.Party === "Democrat") {
              return this.democrat;
            } else if (d.member.Party === "Republican") {
              return this.republican;
            } else {
              return this.otherParty;
            }
          } else {
            return oranges[i % 3];
          }
        })
        .attr("transform", `translate(${radius}, 0)`);
    },
    earliestYear() {
      return new Date(1821, 0, 0, 0);
    },
    latestYear() {
      return new Date(2019, 0, 0, 0);
    },
    maxPeoplePerCongress(dataGroupedByCongressAndMinority) {
      let congressWithMostGroups = dataGroupedByCongressAndMinority.reduce(
        (prev, curr) => {
          return prev > curr ? prev : curr;
        }
      );
      return congressWithMostGroups.Members.length;
    },
    compareParty(a, b) {
      let partyA = a.Party.toUpperCase();
      let partyB = b.Party.toUpperCase();

      // Within this function, treat anyone outside republican & democrat parties as 'AnotherParty' so they'll always appear first
      if (partyA !== "REPUBLICAN" && partyA !== "DEMOCRAT") {
        partyA = "ANOTHER PARTY";
      }
      if (partyB !== "REPUBLICAN" && partyB !== "DEMOCRAT") {
        partyB = "ANOTHER PARTY";
      }

      if (partyA < partyB) {
        return 1;
      }
      if (partyA > partyB) {
        return -1;
      }
      return 0;
    },
    yearsSpan() {
      return Math.floor(
        (this.latestYear() - this.earliestYear()) / MS_PER_YEAR
      );
    },
    completeSpan() {
      return Math.floor(this.latestYear() - this.earliestYear()) / MS_PER_YEAR;
    },
  },
};
</script>

<style scoped>
.chart-options {
  position: absolute;
  right: 50px;
  z-index: 5;
}

@media screen and (max-width: 500px) {
  .chart-options {
    right: -20px;
  }
  .pushOver {
    right: 10px;
    position: fixed;
  }
}

.tl-header {
  background-color: steelblue;
}
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  vertical-align: middle;
  overflow: hidden;
}
</style>
