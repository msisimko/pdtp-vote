import React, { Component } from 'react';
import { compose } from 'recompose';

import Separator from '../../../../../../components/Separator';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import PersonIcon from '@material-ui/icons/Person';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../../../../firebase';

import { AuthUserContext } from '../../../../../../session';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue
  },
  list: {
    width: '100%',
  },
  inline: {
    display: 'inline',
    textTransform: 'capitalize',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const INITIAL_STATE = {
  choice: '',                 // Candidate selected
  visibility: true,           // Show voter information alongside vote they cast when releasing results
  confirmation: false,        // Checkbox to confirm that they understand once they submit their vote, they cannot edit, change or update it
  submitted: false,           // Vote already cast? - used to prevent posting of a bid already submitted : onSubmit() function
  disabled: true,
}

class CampaignTabVoteNowFormBase extends Component {
  static contextType = AuthUserContext;
  
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  componentDidMount() {
    const { id, enqueueSnackbar } = this.props;

    const authUser = this.context;

    this.props.firebase
      .vote(id, authUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            choice: doc.data().candidate,
            visibility: doc.data().visibility,
            confirmation: doc.data().confirmation,
            submitted: doc.data().submitted,
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

  onCheck(event){
    this.setState({ [event.target.name]: event.target.checked });
  };

  onSubmit(event) {
    const { id, enqueueSnackbar } = this.props;

    const { choice, visibility, confirmation, submitted } = this.state;

    const authUser = this.context;

    this.setState({ disabled: true });
 
    /**
     * Using the state { submitted }, we can prevent unscrupulous users who bypass CSS 
     * measures from submitting their data regardless of the bypass. 
     */
    if (!submitted) {
      this.props.firebase
      .votes(id)
      .doc(authUser.uid)
      .set({
        candidate: choice,
        visibility: visibility,
        visibleName: visibility ? authUser.displayName : 'Anonymous',
        confirmation,
        submitted: true,
        createdOn: this.props.firebase.getServerTimestamp(),
        createdBy: authUser.uid,
        createdByName: authUser.displayName,
        createdByEmail: authUser.email,
      })
      .then(() => {
        enqueueSnackbar(`Your vote has been cast successfully.`, { variant: 'success' });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error', onClose: this.handleError });
      });
    } else {
      enqueueSnackbar('You have already cast your vote for this election', { variant: 'error' });
    }
    

    event.preventDefault();
  }

  render() {
    const { classes, allCandidates } = this.props;

    const { choice, visibility, confirmation, disabled } = this.state;

    const disableButton = choice === '' ||
                          confirmation === false;
    
    return(
      <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <List className={classes.list}>
              {allCandidates.map((candidate) => (
                <Box 
                  key={candidate.id}
                  bgcolor={choice === candidate.id ? 'success.light' : 'background.paper'}
                  color={choice === candidate.id ? 'success.contrastText' : 'textPrimary'}
                  borderRadius="borderRadius"
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={candidate.name}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      id={candidate.id}
                      primary={
                        <strong>
                          {candidate.name}
                        </strong>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color={choice === candidate.id ? 'inherit' : 'textPrimary'}
                          >
                            {candidate.age} &bull; {candidate.gender} &mdash; {candidate.organizationDeployed}, {candidate.locationDeployed}
                          </Typography>
                          <br />
                          {candidate.manifesto}
                        </React.Fragment>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Radio
                        name="choice"
                        onChange={this.onChange}
                        value={candidate.id}
                        disabled={disabled}
                        inputProps={{ 'aria-label': candidate.name }}
                        checked={choice === candidate.id}
                        color="default"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </Box>
              ))}
            </List>
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="body2" gutterBottom>
          <strong>Privacy</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibility}
                  onChange={(e) => this.onCheck(e)}
                  name="visibility"
                  color="primary"
                />
              }
              label="Show my PDTP Reg. No. or I.D. No. alongside my vote when the results are officially released."
              disabled={disabled}
            />
          </Grid>
        </Grid>
                
        <Separator />

        <Typography variant="body2" gutterBottom>
          <strong>Important</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirmation}
                  onChange={(e) => this.onCheck(e)}
                  name="confirmation"
                  color="primary"
                />
              }
              label="I understand that once I submit my vote I CANNOT change it."
              disabled={disabled}
            />
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
    )
  }
}

const CampaignTabVoteNowForm = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(CampaignTabVoteNowFormBase);

export default CampaignTabVoteNowForm;
