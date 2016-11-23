import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

export default class Axis extends React.Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const node = this.axis;
    const axis = d3[`axis${_.capitalize(this.props.orient)}`]().ticks(5).scale(this.props.scale);
    d3.select(node).call(axis);
  }

  render() {
    return <g className="axis" ref={(c) => { this.axis = c; }} transform={this.props.translate} />;
  }
}

Axis.propTypes = {
  orient: React.PropTypes.string.isRequired,
  scale: React.PropTypes.func.isRequired,
  translate: React.PropTypes.string.isRequired,
};
