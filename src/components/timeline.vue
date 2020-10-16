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
      dataToUse: {},
    };
  },
  mounted() {
    // let houseOnly = this.filterOutSenate(this.congressMembersData);
    // let statesOnly = this.filterOutNonStates(houseOnly);
    // this.dataToUse = this.showOnlyGroup("Black", statesOnly)
    this.dataToUse = this.showOnlyGroup(
      "Black",
      this.filterOutNonStates(this.filterOutSenate(this.congressMembersData))
    );
    this.generateSVG(this.dataGroupedByCongress);
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
            Group: row.Group,
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
                Group: row.Group,
              },
            ],
          });
        }
      });
      return byCongress;
    },
  },
  methods: {
    generateSVG(dataToUse) {
      console.log(dataToUse);
      const margin = { top: 30, right: 10, bottom: 30, left: 35 };
      const svgWidth = 450;
      const svgHeight = 950;
      const radius = 3;
      const chartWidth = svgWidth - margin.left - margin.right;
      const chartHeight = svgHeight - margin.top - margin.bottom;

      // Setup svg
      const svg = d3
        .select("#timeline")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      // Setup timeline scale and (y) axis
      let tlScale = d3
        .scaleTime()
        .domain([
          // First and Last values on axis
          // Five years before earliestYear
          new Date(this.earliestYear().getTime() - 525600 * 60000 * 5),
          this.latestYear(),
        ])
        .range([margin.top, margin.top + chartHeight]); // what values you want to pop out (y values)
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
        .domain([0, this.maxPeoplePerCongress()])
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
          d.Members.map((member) => {
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
          return nScale(i);
        })
        .attr("r", radius)
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
        return row.Group === group;
      });
    },
    earliestYear() {
      // TODO: Remove hard coding
      return new Date(1853, 0, 0, 0);
    },
    latestYear() {
      // TODO: Remove hard coding
      return new Date(2021, 0, 0, 0);
    },
    maxPeoplePerCongress() {
      // TODO: Remove hard coding
      return 55;
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