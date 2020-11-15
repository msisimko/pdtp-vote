import React, { Component } from 'react';
import { compose } from 'recompose';

// Imported from Campaigns page
import AddCampaign from '../Campaigns/AddCampaign';

import Separator from '../../components/Separator';
import { Main as Sidebar } from '../../components/Sidebar';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withAuthorization, withEmailVerification } from '../../session';

import * as ROLES from '../../constants/roles';

class AdministratorBase extends Component {
  render() {
    return(
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          
          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>Administrator</strong>
              </Typography>
              <Typography align="center" variant="body2" gutterBottom>
                This page is only accessible to administrators.
              </Typography>
            </Box>
          </Paper>

          <Separator />

          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h5" gutterBottom>
                <strong>Application Settings</strong>
              </Typography>
            </Box>
          </Paper>
            
          <AddCampaign />

        </Grid>
        <Grid item md={4} xs={12}>
          
          <Sidebar />

        </Grid>
      </Grid>
    )
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMINISTRATOR];

const Administrator = compose(
  withAuthorization(condition),
  withEmailVerification,
)(AdministratorBase);

export default Administrator;
