import React, { Component } from 'react';
import { compose } from 'recompose';

import Separator from '../../../components/Separator';

import Button from '@material-ui/core/Button';
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
  title: '',                                      // Title of the position being campaigned for, e.g. 2020 PDTP President
  description: '',                                // Describe the position being campaigned for
  campaignStartDateTime: null,                    // When does the campaign start?
  campaignStopDateTime: null,                     // When does the campaign come to an end?
  bidSubmissionOpenDateTime: null,                // From when are potential candidates allowed to submit their bids?
  bidSubmissionCloseDateTime: null,               // When is the deadline for submitting bids?
  votingOpenDateTime: null,                       // When do polls open?
  votingCloseDateTime: null,                      // When do polls close?
  status: 2,                                      // Status { 0 - completed, 1 - ongoing, 2 - upcoming }
  disabled: false,
}

class AddElectionsBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
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

  onSubmit(event) {
    const { enqueueSnackbar } = this.props;

    const { title, description, campaignStartDateTime, campaignStopDateTime, bidSubmissionOpenDateTime, bidSubmissionCloseDateTime, votingOpenDateTime, votingCloseDateTime, status } = this.state;

    const authUser = this.context;

    this.setState({ disabled: true });
 
    this.props.firebase
      .elections()
      .add({
        title,
        description,
        campaignStartDateTime: campaignStartDateTime.toISO(),
        campaignStopDateTime: campaignStopDateTime.toISO(),
        bidSubmissionOpenDateTime: bidSubmissionOpenDateTime.toISO(),
        bidSubmissionCloseDateTime: bidSubmissionCloseDateTime.toISO(),
        votingOpenDateTime: votingOpenDateTime.toISO(),
        votingCloseDateTime: votingCloseDateTime.toISO(),
        status,
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

    const { title, description, campaignStartDateTime, campaignStopDateTime, bidSubmissionOpenDateTime, bidSubmissionCloseDateTime, votingOpenDateTime, votingCloseDateTime, disabled } = this.state;

    const disableButton = title === '' ||
                          campaignStartDateTime === null ||
                          campaignStopDateTime === null ||
                          bidSubmissionOpenDateTime === null ||
                          bidSubmissionCloseDateTime === null ||
                          votingOpenDateTime === null ||
                          votingCloseDateTime === null ||
                          campaignStartDateTime >= bidSubmissionOpenDateTime ||         // Date of STARTING CAMPAIGN can't be later than date of OPENING BID SUBMISSIONS
                          bidSubmissionOpenDateTime >= bidSubmissionCloseDateTime ||    // Date of OPENING BID SUBMISSIONS can't be later than date of CLOSING BID SUBMISSIONS
                          bidSubmissionCloseDateTime >= votingOpenDateTime ||           // Date of CLOSING BID SUBMISSIONS can't be later than date of OPENING POLLS
                          votingOpenDateTime >= votingCloseDateTime ||                  // Date of OPENING POLLS can't be later than date of CLOSING POLLS
                          votingCloseDateTime >= campaignStopDateTime;                  // Date of CLOSING POLLS can't be later than date of STOPPING CAMPAIGN
    
    return(
      <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              helperText="This is the title of the position being campaigned for e.g. 2020 PDTP President."
              label="Election Campaign Title"
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
              label="Election Campaign Description"
              margin="normal"
              name="description"
              onChange={(e) => this.onChange(e)}
              value={description}
              variant="filled"
              disabled={disabled}
              multiline
              rows={4}
              placeholder="Describe the campaign in 140 characters or less..."
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="body2" gutterBottom>
          <strong>Election Campaign Start Date</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DateTimePicker
              fullWidth
              label="When will the Election Campaign start?"
              margin="normal"
              value={campaignStartDateTime}
              onChange={this.onDateTimeChange('campaignStartDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
              disablePast
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="body2" gutterBottom>
          <strong>Bid Submission Dates</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will the bid submission window open, i.e. candidates will be allowed to start submitting their bids to vie?"
              label="Start of Bid Submissions"
              margin="normal"
              value={bidSubmissionOpenDateTime}
              onChange={this.onDateTimeChange('bidSubmissionOpenDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
              disablePast
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will the bid submission window close?"
              label="Stop of Bid Submissions"
              margin="normal"
              value={bidSubmissionCloseDateTime}
              onChange={this.onDateTimeChange('bidSubmissionCloseDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
              disablePast
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="body2" gutterBottom>
          <strong>Voting Dates</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will the elections start?"
              label="Opening of Voting Polls"
              margin="normal"
              value={votingOpenDateTime}
              onChange={this.onDateTimeChange('votingOpenDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
              disablePast
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <DateTimePicker
              fullWidth
              helperText="When will the elections stop?"
              label="Closing of Voting Polls"
              margin="normal"
              value={votingCloseDateTime}
              onChange={this.onDateTimeChange('votingCloseDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
              disablePast
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="body2" gutterBottom>
          <strong>Election Campaign End Date</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DateTimePicker
              fullWidth
              label="When will the Election Campaign stop?"
              margin="normal"
              value={campaignStopDateTime}
              onChange={this.onDateTimeChange('campaignStopDateTime')}
              required
              disabled={disabled}
              showTodayButton
              ampm={false}
              disablePast
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

const AddElections = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(AddElectionsBase);

export default AddElections;
