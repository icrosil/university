import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { GridList, GridTile } from 'material-ui/GridList';
import _ from 'lodash';

import Chart from '../chart';
import { dataCritical, dataCenters, calculateAll } from '../../providers/static';
import styles from './styles';

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
    const M = 100;
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
    const NET_SIZE = 175;
    const ALPHA = 0;
    const VINFABS = 1;
    const net = _.times(NET_SIZE + 1, (i) => _.times(NET_SIZE + 1, (j) => [
      (i * ((DOMAINS.W.max - DOMAINS.W.min) / NET_SIZE)) + DOMAINS.W.min,
      (j * ((DOMAINS.H.max - DOMAINS.H.min) / NET_SIZE)) + DOMAINS.H.min,
    ]));
    const DIVIDER = 40;
    const stylesSize = {
      width: 500,
      height: 300,
      padding: 30,
    };
    this.state = {
      ...stylesSize,
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
      DIVIDER,
      showV: true,
      show: 'CP',
    };
    this.state.stateCopy = { ...this.state };
  }
  process() {
    this.recalculateFields(() => this.setState(calculateAll(this.state), this.labRender));
  }
  recalculateFields(callback) {
    const { NET_SIZE, G0, ALPHA, VINFABS } = this.state;
    const DOMAINS = {
      H: {
        min: +this.state.DOMAINS.H.min,
        max: +this.state.DOMAINS.H.max,
      },
      W: {
        min: +this.state.DOMAINS.W.min,
        max: +this.state.DOMAINS.W.max,
      },
    };
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
      DOMAINS,
      delta,
      dataCritical: dC,
      dataCenters: dataCenters(M, dC),
      net,
      G0: +G0,
      M,
      V: [],
      CP: [],
      F: [],
      PSI: [],
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
      <div style={styles.container}>
        <Chart {...this.state.stateCopy} />
        <Divider />
        <GridList cellHeight={80}>
          <GridTile cols={0.5}>
            <TextField
              value={this.state.DOMAINS.H.min}
              floatingLabelText="Domain height min"
              onChange={(e, value) => this.setState({
                DOMAINS: {
                  ...this.state.DOMAINS,
                  H: {
                    ...this.state.DOMAINS.H,
                    min: value,
                  },
                },
              })}
              type="number"
            />
          </GridTile>
          <GridTile cols={0.5}>
            <TextField
              value={this.state.DOMAINS.H.max}
              floatingLabelText="Domain height max"
              onChange={(e, value) => this.setState({
                DOMAINS: {
                  ...this.state.DOMAINS,
                  H: {
                    ...this.state.DOMAINS.H,
                    max: value,
                  },
                },
              })}
              type="number"
            />
          </GridTile>
          <GridTile cols={0.5}>
            <TextField
              value={this.state.DOMAINS.W.min}
              floatingLabelText="Domain width min"
              onChange={(e, value) => this.setState({
                DOMAINS: {
                  ...this.state.DOMAINS,
                  W: {
                    ...this.state.DOMAINS.W,
                    min: value,
                  },
                },
              })}
              type="number"
            />
          </GridTile>
          <GridTile cols={0.5}>
            <TextField
              value={this.state.DOMAINS.W.max}
              floatingLabelText="Domain width max"
              onChange={(e, value) => this.setState({
                DOMAINS: {
                  ...this.state.DOMAINS,
                  W: {
                    ...this.state.DOMAINS.W,
                    max: value,
                  },
                },
              })}
              type="number"
            />
          </GridTile>
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
          <TextField
            value={this.state.NET_SIZE}
            floatingLabelText="Net size"
            onChange={(e, value) => this.setState({ NET_SIZE: +value })}
            type="number"
          />
          <TextField
            value={this.state.DIVIDER}
            floatingLabelText="Divider (try me)"
            onChange={(e, value) => this.setState({ DIVIDER: +value })}
            type="number"
          />
          <Toggle
            label="show V"
            toggled={this.state.showV}
            onToggle={(e, showV) => this.setState({ showV })}
            labelPosition="right"
          />
          <RadioButtonGroup
            name="show"
            defaultSelected={this.state.show}
            onChange={(e, show) => this.setState({ show })}
          >
            <RadioButton
              value="CP"
              label="show CP"
            />
            <RadioButton
              value="F1"
              label="show F1"
            />
            <RadioButton
              value="PSI"
              label="show PSI"
            />
          </RadioButtonGroup>
          <GridTile style={styles.justify}>
            <RaisedButton label="Calculate" onClick={() => this.process()} />
          </GridTile>
        </GridList>
      </div>
    );
  }
}

export default LabFirst;
