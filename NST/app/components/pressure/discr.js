import React from 'react';
import _ from 'lodash';

import { NUM, maxMinRange, cg, median } from './';

const renderDiscr = ({ height }, i, range) => {
  const style = {
    fill: cg[i === 16 ? 15 : i],
  };
  return (
    <g key={`discr${i}`}>
      <rect
        width={50}
        height={height / NUM}
        x={0} y={((NUM - i - 1) * height) / NUM}
        style={style}
      />
      <text
        x={0} y={(((NUM - i - 1) * height) / NUM) + 9}
        fontFamily="Verdana"
        fontSize={9}
        fill="white"
      >
      {range[i]}
      </text>
    </g>
  );
};

renderDiscr.propTypes = {
  height: React.PropTypes.number.isRequired,
};

class Discr extends React.Component {
  constructor(props) {
    super(props);
    this.fields = ['CP', 'show', 'F1', 'PSI'];
  }
  shouldComponentUpdate(nextProps) {
    if (_.every(
      this.fields, (field) => _.isEqual(nextProps[field], this.props[field])
    )) return false;
    return true;
  }
  render() {
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
        {_.times(this.props[this.props.show].length ? NUM : 0).map((val, i) =>
          renderDiscr(this.props, i, range))}
      </g>
    );
  }
}

Discr.propTypes = {
  CP: React.PropTypes.array.isRequired,
  F1: React.PropTypes.array.isRequired,
  PSI: React.PropTypes.array.isRequired,
  show: React.PropTypes.string.isRequired,
};
Discr.defaultProps = {
  CP: [],
  F1: [],
  PSI: [],
};

export default Discr;
