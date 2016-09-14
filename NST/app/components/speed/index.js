import React from 'react';
import Victor from 'victor';

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

const Speed = (props) => (
  <g>
    {props.V.map((row, i) => row.map((point, j) =>
      renderSpeed(props, i, j, point)))}
  </g>
);

Speed.propTypes = {
  V: React.PropTypes.array.isRequired,
};
Speed.defaultProps = {
  V: [],
};

export default Speed;
