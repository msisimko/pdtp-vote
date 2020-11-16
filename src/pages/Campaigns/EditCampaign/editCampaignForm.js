import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Separator from '../../../components/Separator';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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
  title: '',                                      // Title of the position being campaigned for, e.g. 2020 PDTP President
  description: '',                                // Describe the position being campaigned for
  campaignStartDateTime: null,                    // When does the campaign start?
  campaignStopDateTime: null,                     // When does the campaign come to an end?
  bidSubmissionOpenDateTime: null,                // From when are potential candidates allowed to submit their bids?
  bidSubmissionCloseDateTime: null,               // When is the deadline for submitting bids?
  votingOpenDateTime: null,                       // When do polls open?
  votingCloseDateTime: null,                      // When do polls close?
  featured: false,                                // Featured on homepage? { false -no, true - yes }
  createdBy: '',                                  // Author ID
  disabled: true,
}

class EditCampaignFormBase extends Component {
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
    const { id, enqueueSnackbar } = this.props;

    this.props.firebase
      .election(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            featured: doc.data().featured,
            campaignStartDateTime: DateTime.fromISO(doc.data().campaignStartDateTime),
            campaignStopDateTime: DateTime.fromISO(doc.data().campaignStopDateTime),
            bidSubmissionOpenDateTime: DateTime.fromISO(doc.data().bidSubmissionOpenDateTime),
            bidSubmissionCloseDateTime: DateTime.fromISO(doc.data().bidSubmissionCloseDateTime),
            votingOpenDateTime: DateTime.fromISO(doc.data().votingOpenDateTime),
            votingCloseDateTime: DateTime.fromISO(doc.data().votingCloseDateTime),
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
  onDateTimeChange = (id) => (datetime) => {
    this.setState({ [id]: datetime });
  }
 
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChecked(event){
    this.setState({ [event.target.name]: event.target.checked });
  };

  handleDelete() {
    const { enqueueSnackbar } = this.props;

    const { id, title } = this.state;

    this.setState({ disabled: true });

    this.props.firebase
      .election(id)
      .delete()
      .then(() => {
        enqueueSnackbar(`${title} has been deleted successfully.`, { variant: 'success',  onClose: this.props.history.push(ROUTES.CAMPAIGNS) });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error', onClose: this.handleError });
      });
  };

  onSubmit(event) {
    const { id, enqueueSnackbar } = this.props;

    const { title, description, campaignStartDateTime, campaignStopDateTime, bidSubmissionOpenDateTime, bidSubmissionCloseDateTime, votingOpenDateTime, votingCloseDateTime, featured } = this.state;

    const authUser = this.context;

    this.setState({ disabled: true });
 
    this.props.firebase
      .election(id)
      .update({
        title,
        description,
        campaignStartDateTime: campaignStartDateTime.toISO(),
        campaignStopDateTime: campaignStopDateTime.toISO(),
        bidSubmissionOpenDateTime: bidSubmissionOpenDateTime.toISO(),
        bidSubmissionCloseDateTime: bidSubmissionCloseDateTime.toISO(),
        votingOpenDateTime: votingOpenDateTime.toISO(),
        votingCloseDateTime: votingCloseDateTime.toISO(),
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

    const { title, description, campaignStartDateTime, campaignStopDateTime, bidSubmissionOpenDateTime, bidSubmissionCloseDateTime, votingOpenDateTime, votingCloseDateTime, featured, createdBy, disabled } = this.state;
    
    const authUser = this.context;

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
      <Paper elevation={0} square>
        <Box p={3}>
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
                />
              </Grid>
            </Grid>

            <Separator />

            <Typography variant="body2" gutterBottom>
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
                  label="Feature this Election Campaign on the Homepage"
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
                  Update Campaign Details
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
                  Delete Campaign
                </Button>
              </Box>
            </Box>
            
          </form>
        </Box>
      </Paper>
    );
  }
}

const EditCampaignForm = compose(
  withRouter,
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(EditCampaignFormBase);

export default EditCampaignForm;
