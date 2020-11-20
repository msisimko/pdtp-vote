import React, { Component } from 'react';
import { compose } from 'recompose';

import { ListElections } from '../../components/Elections';
import { Separator } from '../../components/Separator';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withAuthorization, withEmailVerification } from '../../session';

class ElectionsBase extends Component {
  render() {
    return(
      <Grid container spacing={2}>
        <Grid item xs={12}>
          
          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>Elections</strong>
              </Typography>
              <Typography align="center" variant="body2" gutterBottom>
                This page is only accessible to logged in users.
              </Typography>
            </Box>
          </Paper>

          <Separator />
            
          <ListElections />

        </Grid>
      </Grid>
    )
  }
}

const condition = authUser => !!authUser;

const Elections = compose(
  withAuthorization(condition),
  withEmailVerification,
)(ElectionsBase);

export default Elections;
