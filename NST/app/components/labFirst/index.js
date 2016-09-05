import React from 'react';

import Chart from '../chart';
import { dataCritical, dataCenters } from '../core/shapeData';

const DOMAINS = {
  H: {
    min: 0,
    max: 10,
  },
  W: {
    min: 0,
    max: 10,
  },
};


const M = 5;
const maxLength = 2 + Math.sqrt(2);
const defaultPoints = [0, 1, maxLength - 1, maxLength];
const smalls = [
  ((DOMAINS.W.max - DOMAINS.W.min) / 2) - 0.5,
  ((DOMAINS.H.max - DOMAINS.H.min) / 2) - 0.5,
];

const dC = dataCritical(M, defaultPoints, maxLength, smalls);

const props = {
  DOMAINS,
  M,
  dataCritical: dC,
  dataCenters: dataCenters(M, dC),
};

class LabFirst extends React.Component {
  componentWillMount() {

  }
  render() {
    return (<Chart {...props} />);
  }
}

export default LabFirst;
