import React from 'react';
import * as d3 from 'd3';

// import DataCircles from '../dataCircles';
import Shape from '../shape';
import XYAxis from '../axis/XYAxis';
import Pressure from '../pressure';
import Discr from '../pressure/discr';
import Speed from '../speed';

// Returns a function that "scales" X coordinates from the data to fit the chart
export const xScale = ({ DOMAINS, padding, width }) => (
  d3.scaleLinear()
    .domain([DOMAINS.W.min, DOMAINS.W.max])
    .range([padding, width - (padding * 2)])
);

// Returns a function that "scales" Y coordinates from the data to fit the chart
export const yScale = ({ DOMAINS, padding, height }) => (
  d3.scaleLinear()
    .domain([DOMAINS.H.min, DOMAINS.H.max])
    .range([height - padding, padding])
);

const scatterPlot = (props) => {
  const scales = { xScale: xScale(props), yScale: yScale(props) };
  return (
    <div style={{ margin: '0 auto' }}>
      <svg width={props.width} height={props.height} className="mainSvg">
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="0" refY="3"
            orient="auto"
            markerUnits="strokeWidth"
            viewBox="0 0 20 20"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="black" />
          </marker>
        </defs>
        <Shape {...props} {...scales} />
        <XYAxis {...props} {...scales} />
        <Pressure {...props} {...scales} />
        <Speed {...props} {...scales} />
      </svg>
      <svg width={50} height={props.height}>
        <Discr {...props} {...scales} />
      </svg>
    </div>
  );
};

scatterPlot.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  DOMAINS: React.PropTypes.object.isRequired,
  padding: React.PropTypes.number.isRequired,
};

export default scatterPlot;
