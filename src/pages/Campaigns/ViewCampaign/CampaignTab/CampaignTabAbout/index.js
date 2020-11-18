import React, { Component } from 'react';
import { compose } from 'recompose';

import Separator from '../../../../../components/Separator';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import LabelIcon from '@material-ui/icons/Label';
import LabelOffIcon from '@material-ui/icons/LabelOff';

import Skeleton from '@material-ui/lab/Skeleton';

import { DateTime } from "luxon";

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../../../firebase';

const INITIAL_STATE = {
  title: '',                                      // Title of the position being campaigned for, e.g. 2020 PDTP President
  description: '',                                // Describe the position being campaigned for
  campaignStartDateTime: null,                    // When does the campaign start?
  campaignStopDateTime: null,                     // When does the campaign come to an end?
  bidSubmissionOpenDateTime: null,                // From when are potential candidates allowed to submit their bids?
  bidSubmissionCloseDateTime: null,               // When is the deadline for submitting bids?
  votingOpenDateTime: null,                       // When do polls open?
  votingCloseDateTime: null,                      // When do polls close?
  featured: false,                                // Featured on homepage? { false -no, true - yes }
  createdOn: '',                                  // Campaign created on
  createdByName: '',                              // Campaign created by
  loading: true,
}

class CampaignTabAboutBase extends Component {
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
            title: doc.data().title,
            description: doc.data().description,                                                        // Check if blank
            featured: doc.data().featured,
            campaignStartDateTime: DateTime.fromISO(doc.data().campaignStartDateTime),
            campaignStopDateTime: DateTime.fromISO(doc.data().campaignStopDateTime),
            bidSubmissionOpenDateTime: DateTime.fromISO(doc.data().bidSubmissionOpenDateTime),
            bidSubmissionCloseDateTime: DateTime.fromISO(doc.data().bidSubmissionCloseDateTime),
            votingOpenDateTime: DateTime.fromISO(doc.data().votingOpenDateTime),
            votingCloseDateTime: DateTime.fromISO(doc.data().votingCloseDateTime),
            createdOn: doc.data().createdOn,
            createdByName: doc.data().createdByName,
            loading: false,
          })
        }
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { title, description, campaignStartDateTime, campaignStopDateTime, bidSubmissionOpenDateTime, bidSubmissionCloseDateTime, votingOpenDateTime, votingCloseDateTime, featured, createdOn, createdByName, loading } = this.state;
    
    /**
     * Calculate Status - Campaign Start, Bid Submissions, Voting, Campaign Stop 
    */

    // Get current DateTime
    const now = DateTime.local()
    
    // Initialize an empty object, status
    let status = {};

    if (now < DateTime.fromISO(campaignStartDateTime)) {
      status['message'] = `Campaign starts on ${DateTime.fromISO(campaignStartDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'background.paper';
      status['bgColor'] = 'text.disabled';
    } else if (now >= DateTime.fromISO(campaignStartDateTime) && now < DateTime.fromISO(bidSubmissionOpenDateTime)) {
      status['message'] = `Bid Submissions start on ${DateTime.fromISO(bidSubmissionOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'info.contrastText';
      status['bgColor'] = 'info.main';
    } else if (now >= DateTime.fromISO(bidSubmissionOpenDateTime) && now < DateTime.fromISO(bidSubmissionCloseDateTime)) {
      status['message'] = `Bid Submissions ongoing until ${DateTime.fromISO(bidSubmissionCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'success.contrastText';
      status['bgColor'] = 'success.main';
    } else if (now >= DateTime.fromISO(bidSubmissionCloseDateTime) && now < DateTime.fromISO(votingOpenDateTime)) {
      status['message'] = `Bid Submissions closed. Voting starts on ${DateTime.fromISO(votingOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'info.contrastText';
      status['bgColor'] = 'info.main';
    } else if (now >= DateTime.fromISO(votingOpenDateTime) && now < DateTime.fromISO(votingCloseDateTime)) {
      status['message'] = `Voting ongoing until ${DateTime.fromISO(votingCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'success.contrastText';
      status['bgColor'] = 'success.main';
    } else if (now >= DateTime.fromISO(votingCloseDateTime) && now < DateTime.fromISO(campaignStopDateTime)) {
      status['message'] = `Voting closed. Results to be announced on ${DateTime.fromISO(campaignStopDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'error.contrastText';
      status['bgColor'] = 'error.main';
    } else if (now >= DateTime.fromISO(campaignStopDateTime)) {
      status['message'] = `Campaign ended on ${DateTime.fromISO(campaignStopDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'background.paper';
      status['bgColor'] = 'text.disabled';
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
            
            <Separator />
            
            {/* Title & Featured (!) icon */}
            <Box px={1}> {/* padding of 1, x-axis */}
              <Box display="flex">
                <Box>
                  {featured ? (
                    <Tooltip title="Featured">
                      <IconButton aria-label="Featured">
                        <LabelIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Not Featured">
                      <IconButton aria-label="Not Featured">
                          <LabelOffIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Box p={1} ml={3}>
                  <Typography variant="h4" gutterBottom>
                    <strong>{title}</strong>
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Separator />
            
            {/* Description */}
            <Box px={3}> {/* padding of 3, x-axis - standard padding for components */}
              { description !== '' ? (
                <Box textAlign="justify">
                  <Typography variant="body2" gutterBottom>
                    {description}
                  </Typography>
                </Box>
              ): (
                <Box color="text.disabled" textAlign="center" p={3}>
                  <Typography variant="body2" gutterBottom>
                    No description provided for this campaign.
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Separator />
            
            {/* Important Dates */}
            <Box px={1}> {/* padding of 1, x-axis */}
              <TableContainer>
                <Table aria-label="Important Dates">
                  {createdOn !== '' && (
                    <caption>The following campaign was created on {DateTime.fromObject(createdOn.toDate()).toLocaleString(DateTime.DATETIME_MED)} by {createdByName}.</caption>
                  )}
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>Important Dates</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">{DateTime.fromISO(campaignStartDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                      <TableCell>The Election Campaign officially launches.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{DateTime.fromISO(bidSubmissionOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                      <TableCell>The Bid Submission Window officially opens.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{DateTime.fromISO(bidSubmissionCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                      <TableCell>The Bid Submission Window officially closes.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{DateTime.fromISO(votingOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                      <TableCell>Voting officially begins.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{DateTime.fromISO(votingCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                      <TableCell>Voting officially ends.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">{DateTime.fromISO(campaignStopDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                      <TableCell>The Winner is officially announced.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const CampaignTabAbout = compose(
  withSnackbar,
  withFirebase,
)(CampaignTabAboutBase);

export default CampaignTabAbout;
