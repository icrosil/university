import React from 'react';
import _ from 'lodash';

import Axis from './';

class XYAxis extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (_.isEqual(nextProps.height, this.props.height)) return false;
    return true;
  }
  render() {
    const xSettings = {
      translate: `translate(0, ${this.props.height - this.props.padding})`,
      scale: this.props.xScale,
      orient: 'bottom',
    };
    const ySettings = {
      translate: `translate(${this.props.padding}, 0)`,
      scale: this.props.yScale,
      orient: 'left',
    };
    return (<g className="xy-axis">
      <Axis {...xSettings} />
      <Axis {...ySettings} />
    </g>);
  }
}

XYAxis.propTypes = {
  height: React.PropTypes.number.isRequired,
  padding: React.PropTypes.number.isRequired,
  xScale: React.PropTypes.func.isRequired,
  yScale: React.PropTypes.func.isRequired,
};

export default XYAxis;
