import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import { GridList, GridTile } from 'material-ui/GridList';
import _ from 'lodash';

import Chart from '../chart';
import { dataCritical, dataCenters, calculateAll } from '../../providers/static';

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

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
    const ALPHA = 0;
    const VINFABS = 1;
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
      ALPHA,
      VINFABS,
    };
    this.state.stateCopy = { ...this.state };
  }
  process() {
    this.setState(calculateAll(this.state), this.labRender);
  }
  recalculateFields(callback) {
    const { DOMAINS, NET_SIZE, G0, ALPHA, VINFABS } = this.state;
    const M = this.state.M < 4 ? 4 : this.state.M;
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
    const net = _.times(NET_SIZE + 1, (i) => _.times(NET_SIZE + 1, (j) => [
      (i * ((DOMAINS.W.max - DOMAINS.W.min) / NET_SIZE)) + DOMAINS.W.min,
      (j * ((DOMAINS.H.max - DOMAINS.H.min) / NET_SIZE)) + DOMAINS.H.min,
    ]));
    this.setState({
      delta,
      dataCritical: dC,
      dataCenters: dataCenters(M, dC),
      net,
      G0: +G0,
      M,
      VINF: [
        Math.abs(VINFABS) * Math.cos(toRadians(ALPHA)),
        Math.abs(VINFABS) * Math.sin(toRadians(ALPHA)),
      ],
    }, callback);
  }
  labRender(callback = _.noop) {
    this.setState({
      stateCopy: _.omit(this.state, 'stateCopy'),
    }, callback);
  }
  render() {
    return (
      <div>
        <Chart {...this.state.stateCopy} />
        <Divider />
        <GridList cellHeight={80}>
          <TextField
            value={this.state.M}
            floatingLabelText="Critical points quantity (gte than 4)"
            onChange={(e, value) => this.setState({ M: +value })}
            type="number"
          />
          <TextField
            value={this.state.G0}
            floatingLabelText="G0"
            onChange={(e, value) => this.setState({ G0: value })}
            type="number"
          />
          <TextField
            value={this.state.ALPHA}
            floatingLabelText="Alpha angle (grad)"
            onChange={(e, value) => this.setState({ ALPHA: value })}
            type="number"
          />
          <GridTile>
            <RaisedButton
              label="Render"
              onClick={() => this.recalculateFields(() => this.labRender())}
            />
          </GridTile>
          <GridTile>
            <RaisedButton label="Calculate" onClick={() => this.process()} />
          </GridTile>
        </GridList>
      </div>
    );
  }
}

export default LabFirst;
