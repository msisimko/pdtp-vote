import React, { Component } from 'react';
import { compose } from 'recompose';

import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';

import Separator from '../../components/Separator';
import { Main as Sidebar } from '../../components/Sidebar';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withAuthorization, withEmailVerification } from '../../session';

class SettingsBase extends Component {
  render() {
    return(
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>

          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>Settings</strong>
              </Typography>
              <Typography align="center" variant="body2" gutterBottom>
                This page is only accessible to logged in users.
              </Typography>
            </Box>
          </Paper>

          <Separator />

          {/* Update email form */}
          <Paper elevation={0} square>
            <Box p={3}>
              <UpdateEmail />
            </Box>
          </Paper>
          
          <Separator />
          
          {/* Update password form */}
          <Paper elevation={0} square>
            <Box p={3}>
              <UpdatePassword />
            </Box>
          </Paper>

        </Grid>
        <Grid item md={4} xs={12}>

          <Sidebar />

        </Grid>
      </Grid>
    );
  }
}

const condition = authUser => !!authUser;

const Settings = compose(
  withAuthorization(condition),
  withEmailVerification,
)(SettingsBase);

export default Settings;

export { UpdateEmail, UpdatePassword };
