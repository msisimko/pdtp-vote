import React, { Component } from 'react';
import { compose } from 'recompose';

import CampaignTabSubmitBidForm from './campaignTabSubmitBidForm';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

import { DateTime } from "luxon";

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../../../firebase';

const INITIAL_STATE = {
  bidSubmissionOpenDateTime: null,
  bidSubmissionCloseDateTime: null,
  loading: true,
}

class CampaignTabSubmitBase extends Component {
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
            bidSubmissionOpenDateTime: DateTime.fromISO(doc.data().bidSubmissionOpenDateTime),
            bidSubmissionCloseDateTime: DateTime.fromISO(doc.data().bidSubmissionCloseDateTime),
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

    const { bidSubmissionOpenDateTime, bidSubmissionCloseDateTime, loading } = this.state;
    
    /**
     * Calculate Status - Bid Submissions Open Date, Bid Submissions Ongoing, Bid Submissions Closed 
    */

    // Get current DateTime
    const now = DateTime.local()
    
    // Initialize an empty object, status
    let status = {};

    if (now < DateTime.fromISO(bidSubmissionOpenDateTime)) {
      status['message'] = `Bid Submissions Window opens on ${DateTime.fromISO(bidSubmissionOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'info.contrastText';
      status['bgColor'] = 'info.main';
    } else if (now >= DateTime.fromISO(bidSubmissionOpenDateTime) && now < DateTime.fromISO(bidSubmissionCloseDateTime)) {
      status['message'] = 'Bid Submissions currently ongoing. Submit your candidacy bid below!';
      status['color'] = 'success.contrastText';
      status['bgColor'] = 'success.main';
    } else if (now >= DateTime.fromISO(bidSubmissionCloseDateTime)) {
      status['message'] = `Bid Submissions Window closed on ${DateTime.fromISO(bidSubmissionCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
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
            
            {/* If Submit Bid Window is open, show Submit Bid form */}
            {(now >= DateTime.fromISO(bidSubmissionOpenDateTime) && now < DateTime.fromISO(bidSubmissionCloseDateTime)) && (
              <Box p={2}> {/* padding of 2, all rounded - to match forms in Accordions */}
                <CampaignTabSubmitBidForm id={id} />
              </Box>
            )}

          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const CampaignTabSubmit = compose(
  withSnackbar,
  withFirebase,
)(CampaignTabSubmitBase);

export default CampaignTabSubmit;

export { CampaignTabSubmitBidForm };
