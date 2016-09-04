import React from 'react';

import Axis from '../axis';

const XYAxis = (props) => {
  const xSettings = {
    translate: `translate(0, ${props.height - props.padding})`,
    scale: props.xScale,
    orient: 'bottom',
  };
  const ySettings = {
    translate: `translate(${props.padding}, 0)`,
    scale: props.yScale,
    orient: 'left',
  };
  return (<g className="xy-axis">
    <Axis {...xSettings} />
    <Axis {...ySettings} />
  </g>);
};

XYAxis.propTypes = {
  height: React.PropTypes.number.isRequired,
  padding: React.PropTypes.number.isRequired,
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
};

export default XYAxis;
