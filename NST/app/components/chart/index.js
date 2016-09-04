import React from 'react';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';

import ScatterPlot from '../scatterPlot';

const styles = {
  width: 500,
  height: 300,
  padding: 30,
};

// The number of data points for the chart.
const numDataPoints = 50;

// A function that returns a random number from 0 to 1000
const randomNum = () => Math.floor(Math.random() * 1000);

// A function that creates an array of 50 elements of (x, y) coordinates.
const randomDataSet = () => (
  _.times(numDataPoints, () => [randomNum(), randomNum()])
);

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: randomDataSet() };
  }

  randomizeData() {
    this.setState({ data: randomDataSet() });
  }

  render() {
    return (
      <div>
        <h1>Playing With React and D3</h1>
        <ScatterPlot {...this.state} {...styles} />
        <div className="controls">
          <RaisedButton label="Randomize Data" onClick={() => this.randomizeData()} />
        </div>
      </div>
    );
  }
}
