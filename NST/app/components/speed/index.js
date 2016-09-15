import React from 'react';
import Victor from 'victor';
import _ from 'lodash';

const renderSpeed = ({ xScale, yScale, net, DIVIDER }, i, j, point) => {
  const divider = new Victor(DIVIDER, DIVIDER);
  const xy1 = Victor.fromArray(net[i][j]);
  const xy2 = Victor.fromArray(net[i][j]).add(Victor.fromArray(point).divide(divider));
  return (
    <g>
      <line
        x1={xScale(xy1.x)} y1={yScale(xy1.y)}
        x2={xScale(xy2.x)} y2={yScale(xy2.y)}
        stroke="black"
        strokeWidth="1"
        markerEnd="url(#arrow)"
      />
    </g>
  );
};

renderSpeed.propTypes = {
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
  net: React.PropTypes.array.isRequired,
  DIVIDER: React.PropTypes.number.isRequired,
};

class Speed extends React.Component {
  constructor(props) {
    super(props);
    this.fields = ['DIVIDER', 'V'];
  }
  shouldComponentUpdate(nextProps) {
    if (_.every(
      this.fields, (field) => _.isEqual(nextProps[field], this.props[field])
    )) return false;
    return true;
  }
  render() {
    return (
      <g>
        {this.props.V.map((row, i) => (i % 6 ? null : row.map((point, j) =>
          (j % 6 ? null : renderSpeed(this.props, i, j, point)))))}
      </g>
    );
  }
}

Speed.propTypes = {
  V: React.PropTypes.array.isRequired,
};
Speed.defaultProps = {
  V: [],
};

export default Speed;
