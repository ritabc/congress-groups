export default {
  houseOnly: function(data) {
    let ret = data.filter((row) => {
      return row.Service === "House";
    });
    return ret;
  },
  statesOnly: function(data) {
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
  bySelectedGroup(group, data) {
    return data.filter((row) => {
      return row.MinorityGroup === group;
    });
  },
};
