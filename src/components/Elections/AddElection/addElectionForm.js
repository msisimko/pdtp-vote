/**
 * TODO:  Limit the word count for the Title (65 characters) & 
 *        Description (240 characters)
 */
import React, { Component } from 'react';
import { compose } from 'recompose';

import { Separator } from '../../Separator';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import { DateTimePicker } from "@material-ui/pickers";

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

import { AuthUserContext } from '../../../session';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue
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
  featured: false,                                // Should the election be featured on the homepage?
  disabled: false,
}

class AddElectionFormBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * onDateTimeChange - an arrow function; does not require binding to this
   */
  onDateTimeChange = (id) => (datetime) => {
    this.setState({ [id]: datetime });
  }
 
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChecked(event){
    this.setState({ [event.target.name]: event.target.checked });
  };

  onSubmit(event) {
    const { enqueueSnackbar } = this.props;

    const { title, description, electionStartDateTime, electionStopDateTime, bidSubmissionStartDateTime, bidSubmissionStopDateTime, votingStartDateTime, votingStopDateTime, eligibleVoters, featured } = this.state;

    const authUser = this.context;
    
    this.setState({ disabled: true });
 
    this.props.firebase
      .elections()
      .add({
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
        createdOn: this.props.firebase.getServerTimestamp(),
        createdBy: authUser.uid,
        createdByName: authUser.displayName,
      })
      .then(() => {
        enqueueSnackbar(`${title} has been added successfully.`, { variant: 'success', onClose: this.handleSuccess });
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

    this.setState({ ...INITIAL_STATE });
  }

  handleError(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ disabled: false });
  }

  render() {
    const { classes } = this.props;

    const { title, description, electionStartDateTime, electionStopDateTime, bidSubmissionStartDateTime, bidSubmissionStopDateTime, votingStartDateTime, votingStopDateTime, eligibleVoters, featured, disabled } = this.state;

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
              label="Eligible Voters (Who can participate in this election?)"
              margin="normal"
              name="eligibleVoters"
              onChange={(e) => this.onChange(e)}
              required
              value={eligibleVoters}
              variant="filled"
              disabled={disabled}
              multiline
              rows={4}
              placeholder="john@example.com,jane@example.com,james@example.com"
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

        <Button
          className={classes.submit}
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={disabled || disableButton }
        >
          Add Election
        </Button>
      </form>
    );
  }
}

const AddElectionForm = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(AddElectionFormBase);

export default AddElectionForm;
