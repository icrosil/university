import React from 'react';

const renderCircles = ({ xScale, yScale }) => (coords, index) => {
  const circleProps = {
    cx: xScale(coords[0]),
    cy: yScale(coords[1]),
    r: 2,
    key: index,
  };
  return <circle {...circleProps} />;
};

renderCircles.propTypes = {
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
};

const dataCircles = (props) => (
  <g>{ props.data.map(renderCircles(props)) }</g>
);

dataCircles.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default dataCircles;
