import React from 'react';
import _ from 'lodash';
import colormap from 'colormap';

export function median(values, multiplyer) {
  const half = Math.floor((values.length * multiplyer) / 6);
  if ((values.length * multiplyer) % 6) {
    return values[half];
  }
  return (values[half - 1] + values[half]) / 2.0;
}

export const NUM = 16;
const options = {
  colormap: 'portland',   // pick a builtin colormap or add your own
  nshades: NUM,       // how many divisions
  format: 'rgbaString',     // "hex" or "rgb" or "rgbaString"
  alpha: 0.6,           // set an alpha value or a linear alpha mapping [start, end]
};
export const cg = colormap(options);
export const maxMinRange = (max, min) => (
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

class Pressure extends React.Component {
  constructor(props) {
    super(props);
    this.fields = ['CP', 'show', 'F1', 'F2', 'F12', 'PSI'];
  }
  shouldComponentUpdate(nextProps) {
    if (_.every(
      this.fields, (field) => _.isEqual(nextProps[field], this.props[field])
    )) return false;
    return true;
  }
  render() {
    if (this.props.show === 'empty') return null;
    const CP = _.sortBy(_.flattenDeep(this.props[this.props.show]));
    const Q1 = median(CP, 2);
    const Q3 = median(CP, 4);
    const interQ = Q3 - Q1;
    const outerQ1 = Q1 - (interQ * 3);
    // const outerQ3 = Q3 + (interQ * 3);
    const outerQ3 = _.last(CP);
    const range = maxMinRange(outerQ3, outerQ1);
    return (
      <g>
        {this.props.show && this.props[this.props.show].map((row, i) => row.map((point, j) =>
          renderPressure(this.props, i, j, point, outerQ3, outerQ1, range)))}
      </g>
    );
  }
}

Pressure.propTypes = {
  DOMAINS: React.PropTypes.object.isRequired,
  CP: React.PropTypes.array.isRequired,
  F1: React.PropTypes.array.isRequired,
  F2: React.PropTypes.array.isRequired,
  PSI: React.PropTypes.array.isRequired,
  show: React.PropTypes.string.isRequired,
};
Pressure.defaultProps = {
  CP: [],
  F1: [],
  F2: [],
  PSI: [],
};

export default Pressure;
