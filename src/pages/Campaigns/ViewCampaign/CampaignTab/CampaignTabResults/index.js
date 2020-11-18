import React, { Component } from 'react';
import { compose } from 'recompose';

import CampaignTabResultsList from './campaignTabResultsList';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

import { DateTime } from "luxon";

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../../../firebase';

const INITIAL_STATE = {
  votingCloseDateTime: null,
  campaignStopDateTime: null,
  loading: true,
}

class CampaignTabResultsBase extends Component {
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
            votingCloseDateTime: DateTime.fromISO(doc.data().votingCloseDateTime),
            campaignStopDateTime: DateTime.fromISO(doc.data().campaignStopDateTime),
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

    const { votingCloseDateTime, campaignStopDateTime, loading } = this.state;
    
    /**
     * Calculate Status - Voting Closed, Campaign Ended 
    */

    // Get current DateTime
    const now = DateTime.local()
    
    // Initialize an empty object, status
    let status = {};

    if (now < DateTime.fromISO(votingCloseDateTime)) {
      status['message'] = `Voting closes on ${DateTime.fromISO(votingCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}. Results to be announced after`;
      status['color'] = 'info.contrastText';
      status['bgColor'] = 'info.main';
    } else if (now >= DateTime.fromISO(campaignStopDateTime)) {
      status['message'] = `The results of this election are out. View below!`;
      status['color'] = 'success.contrastText';
      status['bgColor'] = 'success.main';
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

            {/* If Campaign has ended */}
            {(now >= DateTime.fromISO(campaignStopDateTime)) && (
              <Box p={2}> {/* padding of 2, all rounded - to match forms in Accordions */}
                <CampaignTabResultsList id={id} />
              </Box>
            )}

          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const CampaignTabResults = compose(
  withSnackbar,
  withFirebase,
)(CampaignTabResultsBase);

export default CampaignTabResults;

export { CampaignTabResultsList };