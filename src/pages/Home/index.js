import React, { Component } from 'react';
import { compose } from 'recompose';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withAuthorization, withEmailVerification } from '../../session';

class HomeBase extends Component {
  render() {
    return(
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
    );
  }
}

const condition = authUser => !!authUser;

const Home = compose(
  withAuthorization(condition),
  withEmailVerification,
)(HomeBase);

export default Home;
