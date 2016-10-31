import React from 'react';
import _ from 'lodash';

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
  DOMAINS: React.PropTypes.object.isRequired,
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
  DOMAINS: React.PropTypes.object.isRequired,
};

const pColor = (p) => {
  switch (p) {
    case 0:
      return 'green';
    case 1:
      return 'red';
    case 2:
      return 'blue';
    case 3:
      return 'black';
    default:
      return 'green';
  }
};

const renderVixrs = ({ xScale, yScale }) => (tails, p) => _.map(tails, (coords, index) => {
  const circleProps = {
    x: xScale(coords[0]) - 2,
    y: yScale(coords[1]) - 2,
    width: 4,
    height: 4,
    key: `vixr-${p}-${index}`,
    color: pColor(p),
  };
  return <rect {...circleProps} />;
});

renderVixrs.propTypes = {
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
  DOMAINS: React.PropTypes.object.isRequired,
};

const styleLine = {
  strokeWidth: 1,
  stroke: 'black',
};
const renderShape = ({ xScale, yScale, DOMAINS }) => {
  const xSmall = xScale((((DOMAINS.W.max - DOMAINS.W.min) / 2) - 0.5) + DOMAINS.W.min);
  const xBig = xScale(((DOMAINS.W.max - DOMAINS.W.min) / 2) + 0.5 + DOMAINS.W.min);
  const ySmall = yScale((((DOMAINS.H.max - DOMAINS.H.min) / 2) - 0.5) + DOMAINS.H.min);
  const yBig = yScale(((DOMAINS.H.max - DOMAINS.H.min) / 2) + 0.5 + DOMAINS.H.min);
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
  DOMAINS: React.PropTypes.object.isRequired,
};

class IShape extends React.Component {
  constructor(props) {
    super(props);
    this.fields = ['M', 'DOMAINS', 'tails'];
  }
  render() {
    return (
      <g>
        {renderShape(this.props)}
        {this.props.dataCritical.map(renderCriticalPoints(this.props))}
        {this.props.dataCenters.map(renderCenters(this.props))}
        {this.props.showDots ? this.props.tails.map(renderVixrs(this.props)) : null}
      </g>
    );
  }
}

IShape.propTypes = {
  M: React.PropTypes.number.isRequired,
  DOMAINS: React.PropTypes.object.isRequired,
  dataCritical: React.PropTypes.array.isRequired,
  dataCenters: React.PropTypes.array.isRequired,
  tails: React.PropTypes.array.isRequired,
  showDots: React.PropTypes.bool.isRequired,
};

IShape.defaultProps = {
  tails: [],
  showDots: false,
};

export default IShape;
