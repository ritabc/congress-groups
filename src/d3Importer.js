import { csv, json } from "d3-fetch";
import { selectAll, select, append, attr, create } from "d3-selection";
import {
  domain,
  range,
  nice,
  scaleLinear,
  scaleTime,
  scaleSequential,
} from "d3-scale";
import { axisLeft, ticks, axisBottom } from "d3-axis";
import { geoPath, geoAlbersUsa, svg } from "d3-geo";
import { interpolator } from "d3-scale-chromatic";
import { interpolateRound } from "d3-interpolate";

export default {
  csv,
  selectAll,
  select,
  append,
  attr,
  domain,
  range,
  nice,
  scaleLinear,
  scaleTime,
  axisLeft,
  ticks,
  geoPath,
  geoAlbersUsa,
  svg,
  json,
  scaleSequential,
  interpolator,
  interpolateRound,
  axisBottom,
  create,
};
