import React from 'react';

const renderCriticalPoints = ({ xScale, yScale }) => (coords, index) => {
  const circleProps = {
    cx: xScale(coords[0]),
    cy: yScale(coords[1]),
    r: 3,
    key: `critical-${index}`,
  };
  return <circle {...circleProps} />;
};

renderCriticalPoints.propTypes = {
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
  domains: React.PropTypes.object.isRequired,
};

const renderCenters = ({ xScale, yScale }) => (coords, index) => {
  const circleProps = {
    x: xScale(coords[0]) - 2,
    y: yScale(coords[1]) - 2,
    width: 4,
    height: 4,
    key: `center-${index}`,
  };
  return <rect {...circleProps} />;
};

renderCenters.propTypes = {
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
  domains: React.PropTypes.object.isRequired,
};

const styleLine = {
  strokeWidth: 1,
  stroke: 'black',
};
const renderShape = ({ xScale, yScale, domains }) => {
  const xSmall = xScale(((domains.W.max - domains.W.min) / 2) - 0.5);
  const xBig = xScale(((domains.W.max - domains.W.min) / 2) + 0.5);
  const ySmall = yScale(((domains.H.max - domains.H.min) / 2) - 0.5);
  const yBig = yScale(((domains.H.max - domains.H.min) / 2) + 0.5);
  const line1 = {
    x1: xSmall,
    x2: xSmall,
    y1: yBig,
    y2: ySmall,
    key: 'line1',
  };
  const line2 = {
    x1: xSmall,
    x2: xBig,
    y1: ySmall,
    y2: yBig,
    key: 'line2',
  };
  const line3 = {
    x1: xBig,
    x2: xBig,
    y1: yBig,
    y2: ySmall,
    key: 'line3',
  };
  return (
    <g>
      <line {...line1} {...styleLine} />
      <line {...line2} {...styleLine} />
      <line {...line3} {...styleLine} />
    </g>
  );
};

renderShape.propTypes = {
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
  domains: React.PropTypes.object.isRequired,
};

const IShape = (props) => (
  <g>
    {renderShape(props)}
    {props.dataCritical.map(renderCriticalPoints(props))}
    {props.dataCenters.map(renderCenters(props))}
  </g>
);

IShape.propTypes = {
  M: React.PropTypes.number.isRequired,
  domains: React.PropTypes.object.isRequired,
  dataCritical: React.PropTypes.array.isRequired,
  dataCenters: React.PropTypes.array.isRequired,
};

export default IShape;
