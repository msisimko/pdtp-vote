import React, { Component } from 'react';
import { compose } from 'recompose';

import { FeaturedElections } from '../../components/FeaturedElections';
import { Separator } from '../../components/Separator';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withAuthorization, withEmailVerification } from '../../session';

class HomeBase extends Component {
  render() {
    return(
      <React.Fragment>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            
            <Paper elevation={0} square>
              <Box p={3}>
                <Typography align="center" variant="h4" gutterBottom>
                  <strong>Home</strong>
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
                  <strong>Featured Elections</strong>
                </Typography>
              </Box>
            </Paper>

          </Grid>
        </Grid>

        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Separator />
          </Grid>
        </Grid>

        {/* Featured Elections */}
        <FeaturedElections />

      </React.Fragment>
    );
  }
}

const condition = authUser => !!authUser;

const Home = compose(
  withAuthorization(condition),
  withEmailVerification,
)(HomeBase);

export default Home;
