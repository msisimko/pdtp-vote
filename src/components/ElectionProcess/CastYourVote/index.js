import React, { Component } from 'react';
import { compose } from 'recompose';

import CastYourVoteForm from './castYourVoteForm';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Skeleton from '@material-ui/lab/Skeleton';

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
  teams: [],
  loading: true,
}

class CastYourVoteBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { electionId, enqueueSnackbar } = this.props;

    this.props.firebase
      .candidates(electionId)
      .get()
      .then((querySnapshot) => {
        
        let teams = [];

        querySnapshot.forEach((doc) => {
          teams.push({
            id: doc.id,
            candidateName: doc.data().candidateName,
            slogan: doc.data().slogan,
          });
        });

        this.setState({ 
          teams,
          loading: false,
        });

      }, (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { classes, electionId, votingStartDateTime, votingStopDateTime, eligibleVotersArray } = this.props;

    const { teams, loading } = this.state;

    return(
      <Accordion defaultExpanded elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box p={1} width="100%">
            <Typography className={classes.heading} variant="h6">Cast Your Vote</Typography>
            <Typography className={classes.secondaryHeading} variant="subtitle1">Vote for your favourite candidate.</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {loading ? (
                <Skeleton variant="text" />
              ) : (
                <CastYourVoteForm electionId={electionId} votingStartDateTime={votingStartDateTime} votingStopDateTime={votingStopDateTime} eligibleVotersArray={eligibleVotersArray} teams={teams} />
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

const CastYourVote = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(CastYourVoteBase);

export default CastYourVote;
