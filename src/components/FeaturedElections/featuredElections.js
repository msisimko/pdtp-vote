import React, { Component } from 'react';
import { compose } from 'recompose';

import SingleElectionGrid from './singleElectionGrid';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Skeleton from '@material-ui/lab/Skeleton';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../firebase';
import { Typography } from '@material-ui/core';

const INITIAL_STATE = {
  allElections: [],
  loading: true,
}

class FeaturedElectionsBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { enqueueSnackbar } = this.props;

    this.listener = this.props.firebase
                      .elections()
                      .where('featured', '==', true)
                      .onSnapshot((querySnapshot) => {
                        let allElections = [];
                        querySnapshot.forEach((doc) => {
                          allElections.push({ 
                            id: doc.id,
                            title: doc.data().title,
                            electionStartDateTime: doc.data().electionStartDateTime,
                            electionStopDateTime: doc.data().electionStopDateTime,
                            bidSubmissionStartDateTime: doc.data().bidSubmissionStartDateTime,
                            bidSubmissionStopDateTime: doc.data().bidSubmissionStopDateTime,
                            votingStartDateTime: doc.data().votingStartDateTime,
                            votingStopDateTime: doc.data().votingStopDateTime,
                          });
                        });

                        this.setState({ 
                          allElections,
                          loading: false,
                        });

                      }, (error) => {
                        enqueueSnackbar(error.message, { variant: 'error' });
                      });
  }

  render() {
    const { allElections, loading } = this.state;

    return(
      <React.Fragment>
        {loading ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={0} square>
                <Box p={2}>
                  <Skeleton variant="text" />
                </Box>
              </Paper>
            </Grid>
          </Grid>
          ) : (
            <React.Fragment>
              {allElections.length === 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper elevation={0} square>
                      <Box p={2} color="text.secondary">
                        <Typography variant="body2">There are no featured elections.</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  {allElections.map((election) => (
                    <SingleElectionGrid key={election.id} election={election} />
                  ))}
                </Grid>
              )}
            </React.Fragment>
          )}
      </React.Fragment>
    );
  }
}

const FeaturedElections = compose(
  withSnackbar,
  withFirebase,
)(FeaturedElectionsBase);

export default FeaturedElections;
