import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

// import DataCircles from '../dataCircles';
import Shape from '../shape';
import XYAxis from '../XYAxis';

const DOMAINS = {
  H: {
    min: 0,
    max: 10,
  },
  W: {
    min: 0,
    max: 10,
  },
};

const M = 5;
const maxLength = 2 + Math.sqrt(2);
const defaultPoints = [0, 1, maxLength - 1, maxLength];
const smalls = [
  ((DOMAINS.W.max - DOMAINS.W.min) / 2) - 0.5,
  ((DOMAINS.H.max - DOMAINS.H.min) / 2) - 0.5,
];

// figure comes in first 1-1 square
const transformNumberToPoint = (lined) => (
  _.map(lined, (value) => {
    let result;
    if (value <= 1) {
      result = [0, 1 - value];
    } else if (value <= maxLength - 1) {
      result = [(value - 1) / Math.sqrt(2), (value - 1) / Math.sqrt(2)];
    } else {
      result = [1, maxLength - value];
    }

    result = _.map(result, (v, i) => v + smalls[i]);
    return result;
  })
);

const dataCritical = (() => {
  let result = [];
  if (M < 4) {
    console.error('M should not be less than 4!');
    return result;
  }
  // Make them on line
  result = _.sortBy([...defaultPoints, ...(
    _.times(M - 4, (index) => ((index + 1) / (M - 3)) * maxLength))]
  );
  // Transform into points
  result = transformNumberToPoint(result);
  return result;
})();

const dataCenters = (() => {
  let result = [];
  if (M < 4) {
    console.error('M should not be less than 4!');
    return result;
  }
  // Make them on line
  result = _.times(dataCritical.length - 1, (index) => [
    (dataCritical[index][0] + dataCritical[index + 1][0]) / 2,
    (dataCritical[index][1] + dataCritical[index + 1][1]) / 2,
  ]);
  return result;
})();

// Returns a function that "scales" X coordinates from the data to fit the chart
const xScale = (props) => (
  d3.scaleLinear()
    .domain([DOMAINS.W.min, DOMAINS.W.max])
    .range([props.padding, props.width - (props.padding * 2)])
);

// Returns a function that "scales" Y coordinates from the data to fit the chart
const yScale = (props) => (
  d3.scaleLinear()
    .domain([DOMAINS.H.min, DOMAINS.H.max])
    .range([props.height - props.padding, props.padding])
);

const scatterPlot = (props) => {
  const scales = { xScale: xScale(props), yScale: yScale(props) };
  return (
    <svg width={props.width} height={props.height}>
      <Shape
        {...props}
        {...scales}
        domains={DOMAINS}
        M={M}
        dataCritical={dataCritical}
        dataCenters={dataCenters}
      />
      <XYAxis {...props} {...scales} />
    </svg>
  );
};

scatterPlot.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
};

export default scatterPlot;
