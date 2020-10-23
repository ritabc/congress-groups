<template>
  <div class="py-2">
    <div class="float-right chart-options">
      <div class="text-right">
        <label>Choose a Group to Show Their Representation in Congress</label>
      </div>
      <b-form-select
        v-model="group"
        v-bind:options="groups"
        v-on:change="fetchDataAndGenerateSVG($event, group)"
        class="mx-3"
      >
      </b-form-select>
      <b-form-checkbox
        id="party-checkbox"
        class="my-2 float-right"
        v-model="showParty"
        name="party-checkbox"
        v-on:change="fetchDataAndGenerateSVG($event, group)"
        >Show Distinction By Party</b-form-checkbox
      >
      <div v-if="showParty"></div>
    </div>
    <div id="timeline"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "timeline",
  data() {
    return {
      msg: "Message in Timeline",
      dataToUse: {},
      group: null,
      showParty: false,
      groups: [
        {
          value: null,
          text: "Choose a Group",
        },
        { value: "Black", text: "Black Americans" },
        { value: "Women", text: "Female Americans" },
        { value: "Hispanic", text: "Hispanic Americans" },
        { value: "APA", text: "Asian Pacific Americans" },
      ],
    };
  },
  mounted() {
    // this.fetchDataAndGenerateSVG();
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
    async fetchDataAndGenerateSVG(event, group) {
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
      const margin = { top: 30, right: 10, bottom: 30, left: 35 };
      const svgWidth = 650;
      const svgHeight = 950;
      const radius = 3;
      const chartWidth = svgWidth - margin.left - margin.right;
      const chartHeight = svgHeight - margin.top - margin.bottom;
      const oranges = ["#f0a150", "#f48020", "#c76706"];
      const republican = "#cc0000";
      const democrat = "#4e4eff";
      const otherParty = "#FF00FF";

      // Remove any svg's with .chart that already exist
      d3.selectAll(".chart").remove();

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
        .domain([this.earliestYear(), this.latestYear()])
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
              return democrat;
            } else if (d.member.Party === "Republican") {
              return republican;
            } else {
              return otherParty;
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
    earliestYear() {
      // Hard coded so that timeline axis doesn't change upon group selection
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
  },
};
</script>

<style scoped>
.chart-options {
  position: absolute;
  right: 50px;
}
</style>