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
      const w = 300;
      const h = 850;
      const padding = 30;

      // Setup svg
      const svg = d3
        .select("#timeline")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      // Setup timeline scale and (y) axis
      let tlScale = d3
        .scaleTime()
        .domain([
          // First and Last values on axis
          // Five years before earliestYear
          new Date(this.earliestYear().getTime() - 525600 * 60000 * 5),
          this.latestYear(),
        ])
        .range([0, h - 30]); // what values you want to pop out (y values) - 2nd value must be less than height (850 currently)
      let tlAxis = d3.axisLeft(tlScale).ticks(15); // Can change to ticks every 5 years by ".ticks(30)"

      // Draw timeline axis
      svg
        .append("g")
        .attr("class", "timeline-axis")
        .attr("transform", "translate(30, 0)")
        .call(tlAxis);

      // Setup x scale & axis
      let nScale = d3
        .scaleLinear()
        .domain([0, this.maxPeoplePerCongress()])
        .range([0, 300]);
      let nAxis = d3.axisBottom(nScale);

      // Draw x axis
      svg
        .append("g")
        .attr("class", "n-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(nAxis);

      // Draw each circle at fixed x position
      svg
        .selectAll("circle")
        .data(dataToUse)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cy", (d) => {
          // Display dot for each congressMember, across all groups
          return tlScale(new Date(parseInt(d.SessionBegan), 0, 0, 0));
        })
        // .attr("cx", 50)
        .attr("cx", (d) => {
          console.log(d.Members.length);
          console.log(nScale(d.Members.length));
          return nScale(d.Members.length);
        })
        .attr("r", 5);
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
      return 220;
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