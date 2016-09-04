import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import Chart from './chart';
import './styles/main.scss';

const styles = {
  display: 'flex',
  justifyContent: 'center',
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  toggleDrawer() {
    this.setState({ open: !this.state.open });
  }
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Illia Olenchenko PM-2 (OM)"
            onLeftIconButtonTouchTap={() => this.toggleDrawer()}
          />
          <Paper zDepth={2}>
            <div style={styles} className="chart">
              <Chart />
            </div>
          </Paper>
          <Drawer
            open={this.state.open}
            docked={false}
            onRequestChange={(open) => this.setState({ open })}
          >
            <MenuItem>Lab 1 - Static</MenuItem>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
