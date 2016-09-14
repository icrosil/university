import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';

import Chart from '../chart';
import { dataCritical, dataCenters, calculateAll } from '../../providers/static';


class LabFirst extends React.Component {
  constructor(props) {
    super(props);
    const DOMAINS = {
      H: {
        min: 4,
        max: 6,
      },
      W: {
        min: 4,
        max: 6,
      },
    };
    const M = 30;
    const maxLength = 2 + Math.sqrt(2);
    const defaultPoints = [0, 1, maxLength - 1, maxLength];
    const smalls = [
      (((DOMAINS.W.max - DOMAINS.W.min) / 2) - 0.5) + DOMAINS.W.min,
      (((DOMAINS.H.max - DOMAINS.H.min) / 2) - 0.5) + DOMAINS.H.min,
    ];
    const dC = dataCritical(M, defaultPoints, maxLength, smalls);
    const delta = (_.min(_.times(M - 1, (index) => (
      Math.sqrt(
        Math.pow(dC[index + 1][0] - dC[index][0], 2) +
        Math.pow(dC[index + 1][1] - dC[index][1], 2)
      )
    )))) / 2;
    const NET_SIZE = 15;
    const net = _.times(NET_SIZE + 1, (i) => _.times(NET_SIZE + 1, (j) => [
      (i * ((DOMAINS.W.max - DOMAINS.W.min) / NET_SIZE)) + DOMAINS.W.min,
      (j * ((DOMAINS.H.max - DOMAINS.H.min) / NET_SIZE)) + DOMAINS.H.min,
    ]));
    this.state = {
      VINF: [1, 0],
      DOMAINS,
      M,
      delta,
      dataCritical: dC,
      dataCenters: dataCenters(M, dC),
      G0: 1,
      net,
      NET_SIZE,
    };
  }
  process() {
    this.setState(calculateAll(this.state));
  }
  render() {
    return (
      <div>
        <Chart {...this.state} />
        <RaisedButton label="Calculate" onClick={() => this.process()} />
      </div>
    );
  }
}

export default LabFirst;
