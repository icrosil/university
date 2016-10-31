import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import _ from 'lodash';

import LabFirst from './labFirst';
import LabSecond from './labSecond';
import './styles/main.scss';

const styles = {
  display: 'flex',
  justifyContent: 'center',
};

export default class TabsExampleControlled extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'cynematic',
    };
  }

  handleChange = (value) => {
    if (_.isString(value)) {
      this.setState({
        value,
      });
    }
  };

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Illia Olenchenko PM-2 (OM)"
            showMenuIconButton={false}
          />
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Tab label="Static" value="static" >
              {
                this.state.value === 'static' &&
                  <Paper zDepth={2}>
                    <div style={styles}>
                      <LabFirst />
                    </div>
                  </Paper>
              }
            </Tab>
            <Tab label="Cynematic" value="cynematic" >
              {
                this.state.value === 'cynematic' &&
                  <Paper zDepth={2}>
                    <div style={styles}>
                      <LabSecond />
                    </div>
                  </Paper>
              }
            </Tab>
          </Tabs>
        </div>
      </MuiThemeProvider>
    );
  }
}
