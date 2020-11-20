import React, { Component } from 'react';
import { compose } from 'recompose';

import { Separator } from '../../../components/Separator';

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
 
import { withFirebase } from '../../../firebase';

const INITIAL_STATE = {
  title: '',                                      // Title of the position being competed for, e.g. PDTP Cohort V President
  description: '',                                // Describe the position being competed for
  electionStartDateTime: null,                    // When does the election start?
  electionStopDateTime: null,                     // When does the election stop?
  bidSubmissionStartDateTime: null,                // When does bid submission start?
  bidSubmissionStopDateTime: null,               // When does bid submission stop?
  votingStartDateTime: null,                       // When does voting start?
  votingStopDateTime: null,                      // When does voting stop?
  featured: false,                                // Should this election be featured on the homepage?
  createdOn: '',                                  // election created on
  loading: true,
}

class AboutElectionBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { electionId, enqueueSnackbar } = this.props;

    this.props.firebase
      .election(electionId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            title: doc.data().title,
            description: doc.data().description,                                                        // Check if blank
            featured: doc.data().featured,
            electionStartDateTime: DateTime.fromISO(doc.data().electionStartDateTime),
            electionStopDateTime: DateTime.fromISO(doc.data().electionStopDateTime),
            bidSubmissionStartDateTime: DateTime.fromISO(doc.data().bidSubmissionStartDateTime),
            bidSubmissionStopDateTime: DateTime.fromISO(doc.data().bidSubmissionStopDateTime),
            votingStartDateTime: DateTime.fromISO(doc.data().votingStartDateTime),
            votingStopDateTime: DateTime.fromISO(doc.data().votingStopDateTime),
            createdOn: doc.data().createdOn,
            loading: false,
          })
        }
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { title, description, electionStartDateTime, electionStopDateTime, bidSubmissionStartDateTime, bidSubmissionStopDateTime, votingStartDateTime, votingStopDateTime, featured, createdOn, loading } = this.state;

    return(
      <React.Fragment>
        {loading ? (
          <Skeleton variant="text" />
        ) : (
          <React.Fragment>

            {/* Title & Featured (!) icon */}
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
            
            <Separator />
            
            {/* Description */}
            { description !== '' ? (
              <Box textAlign="justify">
                <Typography variant="body2" gutterBottom>
                  {description}
                </Typography>
              </Box>
            ): (
              <Box color="text.disabled" textAlign="center" p={3}>
                <Typography variant="body2" gutterBottom>
                  No description provided for this election.
                </Typography>
              </Box>
            )}
            
            <Separator />
            
            {/* Important Dates */}
            <TableContainer>
              <Table aria-label="Important Dates">
                {createdOn !== '' && (
                  <caption>This election was created on {DateTime.fromObject(createdOn.toDate()).toLocaleString(DateTime.DATETIME_MED)}.</caption>
                )}
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2}>Important Dates</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">{DateTime.fromISO(electionStartDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                    <TableCell>The Election officially launches.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">{DateTime.fromISO(bidSubmissionStartDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                    <TableCell>The Bid Submission window officially opens.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">{DateTime.fromISO(bidSubmissionStopDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                    <TableCell>The Bid Submission window officially closes.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">{DateTime.fromISO(votingStartDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                    <TableCell>Voting officially begins.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">{DateTime.fromISO(votingStopDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                    <TableCell>Voting officially ends.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">{DateTime.fromISO(electionStopDateTime).toLocaleString(DateTime.DATETIME_MED)}</TableCell>
                    <TableCell>The Winner is officially announced.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const AboutElection = compose(
  withSnackbar,
  withFirebase,
)(AboutElectionBase);

export default AboutElection;
