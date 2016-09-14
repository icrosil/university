import React from 'react';
import _ from 'lodash';
import colormap from 'colormap';


const NUM = 16;
const options = {
  colormap: 'portland',   // pick a builtin colormap or add your own
  nshades: NUM,       // how many divisions
  format: 'rgbaString',     // "hex" or "rgb" or "rgbaString"
  alpha: 0.6,           // set an alpha value or a linear alpha mapping [start, end]
};
const cg = colormap(options);
const maxMinRange = (max, min) => (
  _.times(NUM, (i) => ((i * (max - min)) / NUM) + min)
);

const renderPressure = ({ xScale, yScale, DOMAINS, NET_SIZE }, i, j, point, max, min, range) => {
  const index = _.sortedIndex(range, point);
  const stepW = (DOMAINS.W.max - DOMAINS.W.min) / NET_SIZE;
  const stepH = (DOMAINS.H.max - DOMAINS.H.min) / NET_SIZE;
  const x1 = (DOMAINS.W.min + (i * stepW)) - (stepW / 2);
  const y1 = (DOMAINS.H.min + (j * stepH)) + (stepH / 2);
  const x2 = x1 + stepW;
  const y2 = y1 + stepH;
  const width = xScale(x2) - xScale(x1);
  const height = yScale(y2) - yScale(y1);
  const style = {
    fill: cg[index === 16 ? 15 : index],
  };
  return (
    <g>
      <rect
        width={Math.abs(width)}
        height={Math.abs(height)}
        x={xScale(x1)} y={yScale(y1)}
        style={style}
      />
    </g>
  );
};

renderPressure.propTypes = {
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
  DOMAINS: React.PropTypes.object.isRequired,
  NET_SIZE: React.PropTypes.number.isRequired,
};

const Pressure = (props) => {
  const max = _.max(_.flattenDeep(props.CP));
  const min = _.min(_.flattenDeep(props.CP));
  const range = maxMinRange(max, min);
  return (
    <g>
      {props.CP.map((row, i) => row.map((point, j) =>
        renderPressure(props, i, j, point, max, min, range)))}
    </g>
  );
};

Pressure.propTypes = {
  DOMAINS: React.PropTypes.object.isRequired,
  CP: React.PropTypes.array.isRequired,
};
Pressure.defaultProps = {
  CP: [],
};

export default Pressure;
