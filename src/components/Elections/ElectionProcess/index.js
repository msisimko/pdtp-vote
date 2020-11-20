import React, { Component } from 'react';
import { compose } from 'recompose';

import SubmitBid from './SubmitBid';
import ViewCandidates from './ViewCandidates';
import CastYourVote from './CastYourVote';
import YourCandidateOfChoice from './YourCandidateOfChoice';
import Results from './Results';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Skeleton from '@material-ui/lab/Skeleton';

import { DateTime } from "luxon";

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

const styles = theme => ({
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
});

const INITIAL_STATE = {
  electionStartDateTime: '',
  electionStopDateTime: '',
  bidSubmissionStartDateTime: '',
  bidSubmissionStopDateTime: '',
  votingStartDateTime: '',
  votingStopDateTime: '',
  loading: true,
}

class ElectionProcessBase extends Component {
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
        this.setState({
          electionStopDateTime: doc.data().electionStopDateTime,
          bidSubmissionStartDateTime: doc.data().bidSubmissionStartDateTime,
          bidSubmissionStopDateTime: doc.data().bidSubmissionStopDateTime,
          votingStartDateTime: doc.data().votingStartDateTime,
          votingStopDateTime: doc.data().votingStopDateTime,
          loading: false,
        });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { classes, electionId } = this.props;

    const { electionStopDateTime, bidSubmissionStartDateTime, bidSubmissionStopDateTime, votingStartDateTime, votingStopDateTime, loading } = this.state;

    /**
     * Calculate Status - Submit Bid, View Candidates, Cast Your Vote, Your Candidate Of Choice, Results 
    */

    // Get current DateTime
    const now = DateTime.local()
    
    // Initialize an empty object, status
    let process = '';

    if (now >= DateTime.fromISO(bidSubmissionStartDateTime) && now < DateTime.fromISO(bidSubmissionStopDateTime)) {
      process = <SubmitBid electionId={electionId} />;
    } else if (now >= DateTime.fromISO(bidSubmissionStopDateTime) && now < DateTime.fromISO(votingStartDateTime)) {
      process = <ViewCandidates electionId={electionId} />;
    } else if (now >= DateTime.fromISO(votingStartDateTime) && now < DateTime.fromISO(votingStopDateTime)) {
      process = <CastYourVote electionId={electionId} />;
    } else if (now >= DateTime.fromISO(votingStopDateTime) && now < DateTime.fromISO(electionStopDateTime)) {
      process = <YourCandidateOfChoice electionId={electionId} />;
    } else if (now >= DateTime.fromISO(electionStopDateTime)) {
      process = <Results electionId={electionId} />;
    }

    return(
      <React.Fragment>
        {loading ? (
          <Accordion defaultExpanded elevation={0} square>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box p={1} width="100%">
                <div className={classes.heading}><Skeleton variant="text" width="40%" /></div>
                <div className={classes.secondaryHeading}><Skeleton variant="text" width="70%" /></div>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Skeleton variant="text" />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : (
          <React.Fragment>
            {process}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const ElectionProcess = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(ElectionProcessBase);

export default ElectionProcess;
