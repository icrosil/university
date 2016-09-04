import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Chart from './chart';

const styles = {
  display: 'flex',
  justifyContent: 'center',
};

const Main = () => (
  <MuiThemeProvider>
    <div style={styles} className="chart">
      <Chart />
    </div>
  </MuiThemeProvider>
);

export default Main;
