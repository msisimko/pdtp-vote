import React, { Component } from 'react';
import { compose } from 'recompose';

import SubmitBid from './SubmitBid';

import Separator from '../../components/Separator';
import { Main as Sidebar } from '../../components/Sidebar';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withAuthorization, withEmailVerification } from '../../session';

class BidBase extends Component {
  render() {
    return(
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          
          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>Manage Candidacy</strong>
              </Typography>
              <Typography align="center" variant="body2" gutterBottom>
                This page is only accessible to logged in users.
              </Typography>
            </Box>
          </Paper>

          <Separator />

          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h5" gutterBottom>
                <strong>Launch Your Campaign</strong>
              </Typography>
            </Box>
          </Paper>
            
          <SubmitBid />

        </Grid>
        <Grid item md={4} xs={12}>
          
          <Sidebar />

        </Grid>
      </Grid>
    )
  }
}

const condition = authUser => !!authUser;

const Bid = compose(
  withAuthorization(condition),
  withEmailVerification,
)(BidBase);

export default Bid;
