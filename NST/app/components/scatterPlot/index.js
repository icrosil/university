import React from 'react';
import * as d3 from 'd3';

// import DataCircles from '../dataCircles';
import Shape from '../shape';
import XYAxis from '../XYAxis';

// Returns a function that "scales" X coordinates from the data to fit the chart
const xScale = (props) => (
  d3.scaleLinear()
    .domain([props.DOMAINS.W.min, props.DOMAINS.W.max])
    .range([props.padding, props.width - (props.padding * 2)])
);

// Returns a function that "scales" Y coordinates from the data to fit the chart
const yScale = (props) => (
  d3.scaleLinear()
    .domain([props.DOMAINS.H.min, props.DOMAINS.H.max])
    .range([props.height - props.padding, props.padding])
);

const scatterPlot = (props) => {
  const scales = { xScale: xScale(props), yScale: yScale(props) };
  return (
    <svg width={props.width} height={props.height}>
      <Shape {...props} {...scales} />
      <XYAxis {...props} {...scales} />
    </svg>
  );
};

scatterPlot.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
};

export default scatterPlot;
