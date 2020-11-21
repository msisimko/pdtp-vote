/**
 * TODO:  Limit the word count for the Title (65 characters) & 
 *        Description (240 characters)
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { Separator } from '../../../components/Separator';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import { DateTimePicker } from "@material-ui/pickers";

import { DateTime } from "luxon";

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

import { AuthUserContext } from '../../../session';

import * as ROUTES from '../../../constants/routes';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue
  },
  delete: {
    margin: theme.spacing(3, 0, 2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const INITIAL_STATE = {
  title: '',                                      // Title of the position being competed for, e.g. 2020 PDTP President
  description: '',                                // Describe the position being competed for
  electionStartDateTime: null,                    // When does the election start?
  electionStopDateTime: null,                     // When does the election stop?
  bidSubmissionStartDateTime: null,               // When does bid submission start?
  bidSubmissionStopDateTime: null,                // When does bid submission stop?
  votingStartDateTime: null,                      // When does voting start?
  votingStopDateTime: null,                       // When does voting stop?
  eligibleVoters: '',                             // A list of all eligible voters, separated by commas
  featured: false,                                // Shoould the election be featured on the homepage
  createdBy: '',                                  // Author ID
  disabled: true,
}

class EditElectionFormBase extends Component {
  static contextType = AuthUserContext;
  
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
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
            description: doc.data().description,
            featured: doc.data().featured,
            electionStartDateTime: DateTime.fromISO(doc.data().electionStartDateTime),
            electionStopDateTime: DateTime.fromISO(doc.data().electionStopDateTime),
            bidSubmissionStartDateTime: DateTime.fromISO(doc.data().bidSubmissionStartDateTime),
            bidSubmissionStopDateTime: DateTime.fromISO(doc.data().bidSubmissionStopDateTime),
            votingStartDateTime: DateTime.fromISO(doc.data().votingStartDateTime),
            votingStopDateTime: DateTime.fromISO(doc.data().votingStopDateTime),
            eligibleVoters: doc.data().eligibleVoters,
            createdBy: doc.data().createdBy,
            disabled: false,
          })
        }
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  /**
   * onDateTimeChange - an arrow function; does not require binding to this
   */
  onDateTimeChange = (name) => (datetime) => {
    this.setState({ [name]: datetime });
  }
 
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChecked(event){
    this.setState({ [event.target.name]: event.target.checked });
  };

  handleDelete() {
    const { electionId, enqueueSnackbar } = this.props;

    const { title } = this.state;

    this.setState({ disabled: true });

    this.props.firebase
      .election(electionId)
      .delete()
      .then(() => {
        enqueueSnackbar(`${title} has been deleted successfully.`, { variant: 'success',  onClose: this.props.history.push(ROUTES.ELECTIONS) });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error', onClose: this.handleError });
      });
  };

  onSubmit(event) {
    const { electionId, enqueueSnackbar } = this.props;

    const { title, description, electionStartDateTime, electionStopDateTime, bidSubmissionStartDateTime, bidSubmissionStopDateTime, votingStartDateTime, votingStopDateTime, eligibleVoters, featured } = this.state;

    const authUser = this.context;

    this.setState({ disabled: true });
 
    this.props.firebase
      .election(electionId)
      .update({
        title,
        description,
        electionStartDateTime: electionStartDateTime.toISO(),
        electionStopDateTime: electionStopDateTime.toISO(),
        bidSubmissionStartDateTime: bidSubmissionStartDateTime.toISO(),
        bidSubmissionStopDateTime: bidSubmissionStopDateTime.toISO(),
        votingStartDateTime: votingStartDateTime.toISO(),
        votingStopDateTime: votingStopDateTime.toISO(),
        eligibleVoters,
        eligibleVotersArray: eligibleVoters.toLowerCase().split(','),
        featured,
        lastEditedOn: this.props.firebase.getServerTimestamp(),
        lastEditedBy: authUser.uid,
        lastEditedByName: authUser.displayName,
      })
      .then(() => {
        enqueueSnackbar(`${title} has been updated successfully.`, { variant: 'success', onClose: this.handleSuccess });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error', onClose: this.handleError });
      });

    event.preventDefault();
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
    const { classes } = this.props;

    const { title, description, electionStartDateTime, electionStopDateTime, bidSubmissionStartDateTime, bidSubmissionStopDateTime, votingStartDateTime, votingStopDateTime, eligibleVoters, featured, createdBy, disabled } = this.state;
    
    const authUser = this.context;

    const disableButton = title === '' ||
                          electionStartDateTime === null ||
                          electionStopDateTime === null ||
                          bidSubmissionStartDateTime === null ||
                          bidSubmissionStopDateTime === null ||
                          votingStartDateTime === null ||
                          votingStopDateTime === null ||
                          electionStartDateTime >= bidSubmissionStartDateTime ||          // Date of STARTING ELECTION can't be later than date of STARTING BID SUBMISSION
                          bidSubmissionStartDateTime >= bidSubmissionStopDateTime ||      // Date of STARTING BID SUBMISSION can't be later than date of STOPPING BID SUBMISSION
                          bidSubmissionStopDateTime >= votingStartDateTime ||             // Date of STOPPING BID SUBMISSION can't be later than date of STARTING VOTING
                          votingStartDateTime >= votingStopDateTime ||                    // Date of STARTING VOTING can't be later than date of STOPPING VOTING
                          votingStopDateTime >= electionStopDateTime ||                   // Date of STOPPING VOTING can't be later than date of STOPPING ELECTION
                          eligibleVoters === '';
    
    return(
      <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              helperText="This is the title of the position being competed for e.g. PDTP Cohort V President."
              label="Election Title"
              margin="normal"
              name="title"
              onChange={(e) => this.onChange(e)}
              required
              value={title}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              label="Election Description"
              margin="normal"
              name="description"
              onChange={(e) => this.onChange(e)}
              value={description}
              variant="filled"
              disabled={disabled}
              multiline
              rows={4}
              placeholder="Describe the election in 140 characters or less..."
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="overline" gutterBottom>
          <strong>Important Dates</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will the election start?"
              label="Election Start Date &amp; Time"
              margin="normal"
              value={electionStartDateTime}
              onChange={this.onDateTimeChange('electionStartDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will bid submission start?"
              label="Bid Submission Start Date &amp; Time"
              margin="normal"
              value={bidSubmissionStartDateTime}
              onChange={this.onDateTimeChange('bidSubmissionStartDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will bid submission stop?"
              label="Bid Submission Stop Date &amp; Time"
              margin="normal"
              value={bidSubmissionStopDateTime}
              onChange={this.onDateTimeChange('bidSubmissionStopDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will voting start?"
              label="Voting Start Date &amp; Time"
              margin="normal"
              value={votingStartDateTime}
              onChange={this.onDateTimeChange('votingStartDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will voting stop?"
              label="Voting Stop Date &amp; Time"
              margin="normal"
              value={votingStopDateTime}
              onChange={this.onDateTimeChange('votingStopDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
            />
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will the election stop?"
              label="Election Stop Date &amp; Time"
              margin="normal"
              value={electionStopDateTime}
              onChange={this.onDateTimeChange('electionStopDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="overline" gutterBottom>
          <strong>Eligible Voters</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="eligibleVoters"
              helperText="Insert a list of emails belonging to all the eligible voters separated by a comma ONLY, e.g. a@a.a,b@b.b."
              label="Eligible Voters"
              margin="normal"
              name="eligibleVoters"
              onChange={(e) => this.onChange(e)}
              required
              value={eligibleVoters}
              variant="filled"
              disabled={disabled}
              multiline
              rows={4}
              placeholder="Who can participate in this election?"
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="overline" gutterBottom>
          <strong>Miscellaneous</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={featured}
                  onChange={(e) => this.handleChecked(e)}
                  name="featured"
                  color="primary"
                />
              }
              label="Feature this election on the homepage"
              disabled={disabled}
            />
          </Grid>
        </Grid>
        
        <Box display="flex">
          <Box flexGrow={1}>
            <Button
              className={classes.submit}
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              disabled={disabled || disableButton }
            >
              Update Election
            </Button>
          </Box>
          <Box>
            <Button
              className={classes.delete}
              color="secondary"
              size="large"
              disabled={disabled || disableButton || authUser.uid !== createdBy }
              onClick={this.handleDelete}
            >
              Delete Election
            </Button>
          </Box>
        </Box>
        
      </form>
    );
  }
}

const EditElectionForm = compose(
  withRouter,
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(EditElectionFormBase);

export default EditElectionForm;
