import React, { Component } from 'react';
import { compose } from 'recompose';

import CampaignTabVoteCandidates from './CampaignTabVoteCandidates';
import CampaignTabVoteNow from './CampaignTabVoteNow';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

import { DateTime } from "luxon";

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../../../firebase';

const INITIAL_STATE = {
  bidSubmissionCloseDateTime: null,
  votingOpenDateTime: null,
  votingCloseDateTime: null,
  loading: true,
}

class CampaignTabVoteBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { id, enqueueSnackbar } = this.props;

    this.props.firebase
      .election(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            bidSubmissionCloseDateTime: DateTime.fromISO(doc.data().bidSubmissionCloseDateTime),
            votingOpenDateTime: DateTime.fromISO(doc.data().votingOpenDateTime),
            votingCloseDateTime: DateTime.fromISO(doc.data().votingCloseDateTime),
            loading: false,
          })
        }
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { id } = this.props;

    const { bidSubmissionCloseDateTime, votingOpenDateTime, votingCloseDateTime, loading } = this.state;
    
    /**
     * Calculate Status - Voting Open Date, Voting Ongoing, Voting Closed 
    */

    // Get current DateTime
    const now = DateTime.local()
    
    // Initialize an empty object, status
    let status = {};

    if (now < DateTime.fromISO(bidSubmissionCloseDateTime)) {
      status['message'] = `Voting opens on ${DateTime.fromISO(votingOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'info.contrastText';
      status['bgColor'] = 'info.main';
    } else if (now >= DateTime.fromISO(bidSubmissionCloseDateTime) && now < DateTime.fromISO(votingOpenDateTime)) {
      status['message'] = `The following candidates are vying. Voting opens on ${DateTime.fromISO(votingOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'info.contrastText';
      status['bgColor'] = 'info.main';
    } else if (now >= DateTime.fromISO(votingOpenDateTime) && now < DateTime.fromISO(votingCloseDateTime)) {
      status['message'] = 'Voting ongoing. Cast your vote below!';
      status['color'] = 'success.contrastText';
      status['bgColor'] = 'success.main';
    } else if (now >= DateTime.fromISO(votingCloseDateTime)) {
      status['message'] = `Voting closed on ${DateTime.fromISO(votingCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'error.contrastText';
      status['bgColor'] = 'error.main';
    }

    return(
      <React.Fragment>
        {loading ? (
          <Box p={3}>
            <Skeleton variant="text" />
          </Box>
        ) : (
          <React.Fragment>
            
            {/* Status message - derived from the calculations above */}
            <Box py={1}> {/* padding of 1, y-axis - x-axis to touch borders */}
              <Box bgcolor={status.bgColor} color={status.color} p={1} textAlign="center">
                <Typography variant="overline" gutterBottom>
                  <strong>{status.message}</strong>
                </Typography>
              </Box>
            </Box>

            {/* If Bids have been submitted but Voting closed */}
            {(now >= DateTime.fromISO(bidSubmissionCloseDateTime) && now < DateTime.fromISO(votingOpenDateTime)) && (
              <Box p={2}> {/* padding of 2, all rounded - to match forms in Accordions */}
                <CampaignTabVoteCandidates id={id} />
              </Box>
            )}
            
            {/* If Voting is open, show Voting form */}
            {(now >= DateTime.fromISO(votingOpenDateTime) && now < DateTime.fromISO(votingCloseDateTime)) && (
              <Box p={2}> {/* padding of 2, all rounded - to match forms in Accordions */}
                <CampaignTabVoteNow id={id} />
              </Box>
            )}

          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const CampaignTabVote = compose(
  withSnackbar,
  withFirebase,
)(CampaignTabVoteBase);

export default CampaignTabVote;

export { CampaignTabVoteNow, CampaignTabVoteCandidates };
