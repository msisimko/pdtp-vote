import React, { Component } from 'react';
import { compose } from 'recompose';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography'

import { withStyles } from '@material-ui/core/styles';

import PersonIcon from '@material-ui/icons/Person';

import { DateTime } from "luxon";

import { withSnackbar } from 'notistack';

import { v4 as uuidv4 } from 'uuid';
 
import { withFirebase } from '../../../firebase';

import { AuthUserContext } from '../../../session';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue
  },
  list: {
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const INITIAL_STATE = {
  candidate: '',
  disabled: true,
}

class CastYourVoteFormBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getTeamSelected = this.getTeamSelected.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
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
            candidate: doc.data().candidate,
            disabled: false,
          })
        } else {
          this.setState({ disabled: false });
        }
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }
 
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    const { enqueueSnackbar, electionId, votingStartDateTime, votingStopDateTime, teams } = this.props;

    const authUser = this.context;

    this.setState({ disabled: true });

    /**
     * Get UUID associated with this vote - this is a 
     * universal unique identifier code that will be 
     * displayed with the results of the election
     */
    let uuid = uuidv4();

    /**
     * Filter teams array object, get the team
     * information of the team voted for
     */
    let team = teams.filter(this.getTeamSelected);
    
    if( 
      DateTime.local() >= DateTime.fromISO(votingStartDateTime) 
      && 
      DateTime.local() < DateTime.fromISO(votingStopDateTime) 
    ) {
      /** 
       * If current time (NOW) is:
       *  - Greater than or equal to Voting START DateTime
       *  - Less than Voting STOP DateTime
       * 
       */

      this.props.firebase
        .votes(electionId)
        .doc(authUser.uid)
        .set({
          uuid,
          candidate: team[0].id,
          candidateName: team[0].candidateName,
          candidateSlogan: team[0].slogan,
          createdOn: this.props.firebase.getServerTimestamp(),
          createdBy: authUser.uid,
          createdByName: authUser.displayName,
          createdByEmail: authUser.email,
        }, { merge: true })
        .then(() => {
          enqueueSnackbar('Your vote has been cast successfully.', { variant: 'success', onClose: this.handleSuccess });
        })
        .catch(error => {
          enqueueSnackbar(error.message, { variant: 'error', onClose: this.handleError });
        });

    } else if ( 
      DateTime.local() >= DateTime.fromISO(votingStopDateTime) 
      || 
      DateTime.local() < DateTime.fromISO(votingStartDateTime) 
    ) {
      /** 
       * If current time (NOW) is:
       *  - Great than or equal to Voting STOP DateTime
       *  - Less than Voting START DateTime
       * 
       */

      enqueueSnackbar('You cannot cast your vote at this time.', { variant: 'error' });

    }

    event.preventDefault();
  }

  getTeamSelected(item) {
    const { candidate } = this.state;

    if (item.id === candidate) {
      return true
    } 
  
    return false;
  }

  handleSuccess(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ disabled: false });
  }

  handleError(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ disabled: false });
  }

  render() {
    const { classes, teams } = this.props;

    const { candidate, disabled } = this.state;

    const disableButton = candidate === '';

    return(
      <React.Fragment>
        {teams.length === 0 ? (
          <Box color="text.secondary">
            <Typography variant="body2">There are no candidates participating in this election.</Typography>
          </Box>
        ) : (
          <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                
                <List className={classes.list}>
                  {teams.map((team) => (
                    <ListItem key={team.id}>
                      <ListItemAvatar>
                        <Avatar alt={team.candidateName}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText id={team.id} primary={team.candidateName} secondary={team.slogan} />
                      <ListItemSecondaryAction>
                        <Radio
                          name="candidate"
                          onChange={this.onChange}
                          value={team.id}
                          disabled={disabled}
                          inputProps={{ 'aria-label': team.candidateName }}
                          checked={candidate === team.id}
                          color="default"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>

              </Grid>
            </Grid>

            <Button
              className={classes.submit}
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={disabled || disableButton }
            >
              Submit Vote
            </Button>
          </form>
        )}
      </React.Fragment>
    );
  }
}



const CastYourVoteForm = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(CastYourVoteFormBase);

export default CastYourVoteForm;
