<template>
  <b-container fluid>
    <b-row class="tl-header py-2">
      <b-col offset-lg="3" lg="7">
        <b-form-select
          v-model="group"
          v-bind:options="groups"
          v-on:change="fetchDataAndGenerateSVG(group)"
          class="mx-3"
        >
        </b-form-select>
      </b-col>
    </b-row>
    <b-row class="float-right chart-options pt-4">
      <b-col>
        <b-form-checkbox
          id="party-checkbox"
          class="my-2 float-right"
          v-model="showParty"
          name="party-checkbox"
          v-on:change="fetchDataAndGenerateSVG(group)"
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
    <div id="timeline"></div>
  </b-container>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "timeline",
  data() {
    return {
      msg: "Message in Timeline",
      dataToUse: {},
      group: "Black",
      showParty: false,
      groups: [
        { value: "Black", text: "Showing Black Americans In Congress" },
        { value: "Women", text: "Showing Female Americans In Congress" },
        { value: "Hispanic", text: "Showing Hispanic Americans In Congress" },
        {
          value: "APA",
          text: "Showing Asian Pacific Islander Americans In Congress",
        },
      ],
      republican: "#cc0000",
      democrat: "#4e4eff",
      otherParty: "#FF00FF",
    };
  },
  mounted() {
    this.fetchDataAndGenerateSVG("Black");
    this.group = "Black";
  },
  computed: {
    dataGroupedByCongress: function () {
      // transform data from:
      // [{congress: 56, yearRange: (1985-1938), person: ABC...}, {congress: 56, yearRange: (1985-1938), person: DEF...} ]
      // to
      // [{congres: 56, yearRange: (1985-1938), people: [ABC, DEF...],...}}]
      let byCongress = [];
      this.dataToUse.forEach((row) => {
        if (byCongress.some((c) => c.Congress === row.Congress)) {
          // We already have that congress in byCongress
          let relevantCongress = byCongress.find((c) => {
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
          // If byCongress doesn't have that congress yet
          byCongress.push({
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
      return byCongress;
    },
  },
  methods: {
    async fetchDataAndGenerateSVG(group) {
      let data = await d3.csv("./data/minorityGroupCongressMembers.csv");
      this.dataToUse = this.showOnlyGroup(
        group,
        this.filterOutNonStates(this.filterOutSenate(data))

        // Can also include territories by replacing the line above with this:
        // this.filterOutSenate(data)
      );
      // compute dataGroupedByCongress (based on this.dataToUse)
      this.generateSVG(this.dataGroupedByCongress);
    },
    generateSVG(dataToUse) {
      // Remove any svg's with .chart that already exist
      d3.selectAll(".chart").remove();

      if (dataToUse.length === 0) {
        return;
      }

      const margin = { top: 30, right: 10, bottom: 30, left: 35 };
      const svgWidth = 650;
      const radius = 3;
      const svgHeight = this.yearsSpan(dataToUse) * (radius + 2);
      const chartWidth = svgWidth - margin.left - margin.right;
      const chartHeight = svgHeight - margin.top - margin.bottom;
      const oranges = ["#f0a150", "#f48020", "#c76706"];

      // Setup svg
      const svg = d3
        .select("#timeline")
        .append("svg")
        .attr("class", "chart")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      // Setup timeline scale and (y) axis
      let tlScale = d3
        .scaleTime()
        .domain([this.earliestYear(dataToUse), this.latestYear()])
        .range([margin.top, margin.top + chartHeight]) // what values you want to pop out (y values)
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
        .range([margin.left, margin.left + chartWidth]);

      // Draw x axis
      // let nAxis = d3.axisBottom(nScale).ticks(10);
      // svg
      //   .append("g")
      //   .attr("class", "n-axis")
      //   .attr("transform", `translate(0, ${margin.top + chartHeight})`)
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
        .attr("r", radius - 0.5) // Subtract 0.5 to decrease the amount the dots run together
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
    filterOutSenate(data) {
      let ret = data.filter((row) => {
        return row.Service === "House";
      });
      return ret;
    },
    filterOutNonStates(data) {
      const states = [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
      ];
      let ret = data.filter((row) => {
        return states.includes(row.StateOrTerritory);
      });
      return ret;
    },
    showOnlyGroup(group, data) {
      return data.filter((row) => {
        return row.MinorityGroup === group;
      });
    },
    earliestYear(groupData) {
      // groupData will be sorted already
      return new Date(groupData[0]["SessionBegan"], 0, 0, 0);
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
    yearsSpan(data) {
      const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.24;
      return Math.floor(
        (this.latestYear() - this.earliestYear(data)) / MS_PER_YEAR
      );
    },
  },
};
</script>

<style scoped>
.chart-options {
  position: absolute;
  right: 50px;
}
.tl-header {
  background-color: steelblue;
}
</style>