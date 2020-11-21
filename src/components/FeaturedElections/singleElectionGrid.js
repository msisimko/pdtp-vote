import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { ViewElection } from '../Elections';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { DateTime } from "luxon";

import * as ROUTES from '../../constants/routes';

class SingleElectionGrid extends Component {
  render() {
    const { election } = this.props;

    /**
     * Calculate Status - Election Start, Bid Submissions Start & Stop, Voting Start & Stop, Election Stop 
    */

    // Get current DateTime
    const now = DateTime.local()
    
    // Initialize an empty object, status
    let status = {};

    if (now < DateTime.fromISO(election.electionStartDateTime)) {
      status['message'] = `Election starts on ${DateTime.fromISO(election.electionStartDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'text.disabled';
    } else if (now >= DateTime.fromISO(election.electionStartDateTime) && now < DateTime.fromISO(election.bidSubmissionStartDateTime)) {
      status['message'] = `Bid Submission starts on ${DateTime.fromISO(election.bidSubmissionStartDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'info.main';
    } else if (now >= DateTime.fromISO(election.bidSubmissionStartDateTime) && now < DateTime.fromISO(election.bidSubmissionStopDateTime)) {
      status['message'] = `Bid Submission ongoing until ${DateTime.fromISO(election.bidSubmissionStopDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'success.main';
    } else if (now >= DateTime.fromISO(election.bidSubmissionStopDateTime) && now < DateTime.fromISO(election.votingStartDateTime)) {
      status['message'] = `Voting starts on ${DateTime.fromISO(election.votingStartDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'info.main';
    } else if (now >= DateTime.fromISO(election.votingStartDateTime) && now < DateTime.fromISO(election.votingStopDateTime)) {
      status['message'] = `Voting ongoing until ${DateTime.fromISO(election.votingStopDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'success.main';
    } else if (now >= DateTime.fromISO(election.votingStopDateTime) && now < DateTime.fromISO(election.electionStopDateTime)) {
      status['message'] = `Results to be announced on ${DateTime.fromISO(election.electionStopDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'error.main';
    } else if (now >= DateTime.fromISO(election.electionStopDateTime)) {
      status['message'] = 'Results are out.';
      status['color'] = 'success.main';
    }

    return(
      <React.Fragment>
        <Grid item md={6} xs={12}>
          
          <Paper elevation={0} square>
            <Box p={1} textAlign="center" color="primary.main">
              <Typography variant="overline" gutterBottom>
                <strong>{election.title}</strong>
              </Typography>
            </Box>
          </Paper>

          {/* View Election */}
          <ViewElection electionId={election.id} />

          <Paper elevation={0} square>
            <Box p={1} textAlign="center" color={status.color}>
              <Typography variant="overline" gutterBottom>
                <strong>{status.message}</strong>
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} square>
            <Box p={1} textAlign="center">
              <Button size="large" component={Link} to={`${ROUTES.ELECTION_VIEW}/${election.id}`}>Click To View</Button>
            </Box>
          </Paper>

        </Grid>

      </React.Fragment>
    );
  }
}

export default SingleElectionGrid;
