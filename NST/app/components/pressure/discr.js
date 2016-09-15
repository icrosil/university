import React from 'react';
import _ from 'lodash';

import { NUM, maxMinRange, cg } from './';

const renderDiscr = ({ height }, i, range) => {
  const style = {
    fill: cg[i === 16 ? 15 : i],
  };
  return (
    <g key={`discr${i}`}>
      <rect
        width={50}
        height={height / NUM}
        x={0} y={(i * height) / NUM}
        style={style}
      />
      <text
        x={0} y={((i * height) / NUM) + 9}
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
  shouldComponentUpdate(nextProps) {
    if (_.isEqual(nextProps.CP, this.props.CP)) return false;
    return true;
  }
  render() {
    const max = _.max(_.flattenDeep(this.props.CP));
    const min = _.min(_.flattenDeep(this.props.CP));
    const range = maxMinRange(max, min);
    return (
      <g>
        {_.times(this.props.CP.length ? NUM : 0).map((val, i) => renderDiscr(this.props, i, range))}
      </g>
    );
  }
}

Discr.propTypes = {
  CP: React.PropTypes.array.isRequired,
};
Discr.defaultProps = {
  CP: [],
};

export default Discr;
