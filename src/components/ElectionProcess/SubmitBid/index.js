import React, { Component } from 'react';
import { compose } from 'recompose';

import SubmitBidForm from './submitBidForm';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

class SubmitBidBase extends Component {
  render() {
    const { classes, electionId, bidSubmissionStartDateTime, bidSubmissionStopDateTime } = this.props;

    return(
      <Accordion defaultExpanded elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box p={1} width="100%">
            <Typography className={classes.heading} variant="h6">Submit Bid</Typography>
            <Typography className={classes.secondaryHeading} variant="subtitle1">Submit information about the aspiring candidates.</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              
              <SubmitBidForm electionId={electionId} bidSubmissionStartDateTime={bidSubmissionStartDateTime} bidSubmissionStopDateTime={bidSubmissionStopDateTime} />

            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

const SubmitBid = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(SubmitBidBase);

export default SubmitBid;
