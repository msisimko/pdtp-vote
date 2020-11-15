import React, { Component } from 'react';
import { compose } from 'recompose';

import ListCampaigns from './ListCampaigns';
import EditCampaign from './EditCampaign';
import ViewCampaign from './ViewCampaign';

import Separator from '../../components/Separator';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withAuthorization, withEmailVerification } from '../../session';

class CampaignsBase extends Component {
  render() {
    return(
      <Grid container spacing={2}>
        <Grid item xs={12}>
          
          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>Election Campaigns</strong>
              </Typography>
              <Typography align="center" variant="body2" gutterBottom>
                This page is only accessible to logged in users.
              </Typography>
            </Box>
          </Paper>

          <Separator />
            
          <ListCampaigns />

        </Grid>
      </Grid>
    )
  }
}

const condition = authUser => !!authUser;

const Campaigns = compose(
  withAuthorization(condition),
  withEmailVerification,
)(CampaignsBase);

export default Campaigns;

export { ListCampaigns, EditCampaign, ViewCampaign };
