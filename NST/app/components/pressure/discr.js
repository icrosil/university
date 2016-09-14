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

const Discr = (props) => {
  const max = _.max(_.flattenDeep(props.CP));
  const min = _.min(_.flattenDeep(props.CP));
  const range = maxMinRange(max, min);
  return (
    <g>
      {_.times(props.CP.length ? NUM : 0).map((val, i) => renderDiscr(props, i, range))}
    </g>
  );
};

Discr.propTypes = {
  CP: React.PropTypes.array.isRequired,
};
Discr.defaultProps = {
  CP: [],
};

export default Discr;
