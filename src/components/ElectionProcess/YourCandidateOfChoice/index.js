import React, { Component } from 'react';
import { compose } from 'recompose';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';

import Skeleton from '@material-ui/lab/Skeleton';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

import { AuthUserContext } from '../../../session';

const styles = theme => ({
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
});

const INITIAL_STATE = {
  uuid: '',
  candidate: '',
  candidateName: '',
  runningMateName: '',
  slogan: '',
  loading: true,
}

class YourCandidateOfChoiceBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { electionId, enqueueSnackbar } = this.props;

    const authUser = this.context;

    this.props.firebase
      .vote(electionId, authUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            uuid: doc.data().uuid,
            candidate: doc.data().candidate,
            candidateName: doc.data().candidateName,
            runningMateName: doc.data().runningMateName,
            slogan: doc.data().slogan,
            loading: false,
          })
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { classes } = this.props;

    const { uuid, candidate, candidateName, runningMateName, slogan, loading } = this.state;

    return(
      <Accordion defaultExpanded elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box p={1} width="100%">
            <Typography className={classes.heading} variant="h6">Your Candidate Of Choice</Typography>
            <Typography className={classes.secondaryHeading} variant="subtitle1">View who you voted for.</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {loading ? (
                <Skeleton variant="text" />
              ) : (
                <React.Fragment>
                {candidate === '' ? (
                  <Box color="text.secondary">
                    <Typography variant="body2">You did not cast your vote for any candidate during this election.</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>

                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center">
                          
                        <Box display="flex" alignItems="center">
                          <Box p={3}>
                            <AvatarGroup max={4}>
                              <Avatar className={classes.avatar}>
                                <PersonIcon style={{ fontSize: 60 }} />
                              </Avatar>
                              <Avatar className={classes.avatar}>
                                <PersonIcon style={{ fontSize: 60 }} />
                              </Avatar>
                            </AvatarGroup>
                          </Box>
                          <Box p={3}>
                            <Typography variant="h6" gutterBottom>{candidateName}</Typography>
                            <Typography variant="body1" gutterBottom>{runningMateName}</Typography>
                            <Typography variant="subtitle1" gutterBottom>{slogan}</Typography>
                          </Box>
                        </Box>

                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box textAlign="center">
                        <Typography variant="caption" gutterBottom>{uuid}</Typography>
                      </Box>
                    </Grid>

                  </Grid>
                )}
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

const YourCandidateOfChoice = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(YourCandidateOfChoiceBase);

export default YourCandidateOfChoice;
