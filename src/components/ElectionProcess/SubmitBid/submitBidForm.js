/**
 * TODO:  Limit word count of slogan to 140 characters,
 *        enable image upload for both the candidate and 
 *        the running  mate
 */
import React, { Component } from 'react';
import { compose } from 'recompose';

import { Separator } from '../../Separator';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import { DateTime } from "luxon";

import { withSnackbar } from 'notistack';

import NumberFormat from 'react-number-format';
 
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
  candidateName: '',                                // Name of candidate
  candidateAge: '',                                 // Age of candidate
  candidateGender: '',                              // Gender of candidate
  candidateOrganization: '',                        // Organization of candidate
  candidateLocation: '',                            // Location of candidate
  runningMateName: '',                              // Name of running mate
  runningMateAge: '',                               // Age of running mate
  runningMateGender: '',                            // Gender of running mate
  runningMateOrganization: '',                      // Organization of running mate
  runningMateLocation: '',                          // Location of running mate
  slogan: '',                                       // Campaign slogan
  disabled: true,            
}

class SubmitBidFormBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { electionId, enqueueSnackbar } = this.props;

    const authUser = this.context;

    this.props.firebase
      .candidate(electionId, authUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            candidateName: doc.data().candidateName,
            candidateAge: doc.data().candidateAge,
            candidateGender: doc.data().candidateGender,
            candidateOrganization: doc.data().candidateOrganization,
            candidateLocation: doc.data().candidateLocation,
            runningMateName: doc.data().runningMateName,
            runningMateAge: doc.data().runningMateAge,
            runningMateGender: doc.data().runningMateGender,
            runningMateOrganization: doc.data().runningMateOrganization,
            runningMateLocation: doc.data().runningMateLocation,
            slogan: doc.data().slogan,
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
    const { electionId, enqueueSnackbar, bidSubmissionStartDateTime, bidSubmissionStopDateTime, eligibleVotersArray } = this.props;

    const { candidateName, candidateAge, candidateGender, candidateOrganization, candidateLocation, runningMateName, runningMateAge, runningMateGender, runningMateOrganization, runningMateLocation, slogan } = this.state;

    const authUser = this.context;

    this.setState({ disabled: true });

    /**
     * Check if user's email is eligible to submit bid
     */
    if (eligibleVotersArray.includes(authUser.email)) {

      /**
       * Check if slogan is less than 100 characters
       */
      if (slogan.length <= 100) {

        if( 
            DateTime.local() >= DateTime.fromISO(bidSubmissionStartDateTime) 
            && 
            DateTime.local() < DateTime.fromISO(bidSubmissionStopDateTime) 
          ) {
          /** 
           * If current time (NOW) is:
           *  - Greater than or equal to Bid Submission START DateTime
           *  - Less than Bid Submission STOP DateTime
           * 
           */

          this.props.firebase
            .candidates(electionId)
            .doc(authUser.uid)
            .set({
              candidateName, 
              candidateAge: parseFloat(candidateAge), 
              candidateGender, 
              candidateOrganization, 
              candidateLocation, 
              runningMateName, 
              runningMateAge: parseFloat(runningMateAge), 
              runningMateGender, 
              runningMateOrganization, 
              runningMateLocation,
              slogan,
              createdOn: this.props.firebase.getServerTimestamp(),
              createdBy: authUser.uid,
              createdByName: authUser.displayName,
            }, { merge: true })
            .then(() => {
              enqueueSnackbar('Your candidacy bid has been submitted successfully.', { variant: 'success', onClose: this.handleSuccess });
            })
            .catch(error => {
              enqueueSnackbar(error.message, { variant: 'error', onClose: this.handleError });
            });
          
        } else if ( 
                    DateTime.local() >= DateTime.fromISO(bidSubmissionStopDateTime) 
                    || 
                    DateTime.local() < DateTime.fromISO(bidSubmissionStartDateTime) 
                  ) {
          /** 
           * If current time (NOW) is:
           *  - Great than or equal to Bid Submission STOP DateTime
           *  - Less than Bid Submission START DateTime
           * 
           */
          
          enqueueSnackbar('You cannot submit your candidacy bid at this time.', { variant: 'error' });

        }

      } else {
        enqueueSnackbar('Your word count for Team Slogan has exceded the limit of 100 characters.', { variant: 'error', onClose: this.handleError });
      }

    } else {
      enqueueSnackbar('You are not eligible to participate in this election.', { variant: 'error' });
    }

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

    const { candidateName, candidateAge, candidateGender, candidateOrganization, candidateLocation, runningMateName, runningMateAge, runningMateGender, runningMateOrganization, runningMateLocation, slogan, disabled } = this.state;

    const disableButton = candidateName === '' ||
                          candidateAge === '' ||
                          candidateGender === '' ||
                          candidateOrganization === '' ||
                          candidateLocation === '' ||
                          runningMateName === '' ||
                          runningMateAge === '' ||
                          runningMateGender === '' ||
                          runningMateOrganization === '' ||
                          runningMateLocation === '';
    
    /**
     * Check word count of Team Slogan, 
     * if greater than 100 set to error
     */
    const sloganError = slogan.length > 100 ? true : false;
    
    return(
      <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
        <Typography variant="overline" gutterBottom>
          <strong>Candidate Information</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="candidateName"
              helperText="Enter the full name of the candidate."
              label="Full Name"
              margin="normal"
              name="candidateName"
              onChange={(e) => this.onChange(e)}
              required
              value={candidateName}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <NumberFormat
              fullWidth
              id="candidateAge"
              label="Age"
              margin="normal"
              name="candidateAge"
              required
              value={candidateAge}
              variant="filled"
              disabled={disabled}
              customInput={TextField}
              thousandSeparator
              isNumericString
              onValueChange={(values) => {
                this.onChange({
                  target: {
                    name: 'candidateAge',
                    value: values.value,
                  },
                });
              }}
              format="##"
              mask="_"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl margin="normal" fullWidth variant="filled" disabled={disabled}>
              <InputLabel id="select-gender">Gender</InputLabel>
              <Select 
                labelId="select-gender"
                id="candidateGender"
                name="candidateGender"
                onChange={(e) => this.onChange(e)}
                value={candidateGender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="candidateOrganization"
              helperText="Enter the full name of the organization. Avoid using abbreviations, unless absolutely necessary."
              label="Organization Deployed"
              margin="normal"
              name="candidateOrganization"
              onChange={(e) => this.onChange(e)}
              required
              value={candidateOrganization}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="candidateLocation"
              helperText="Enter the full name of the location. Avoid using addreviations, unless absolutely necessary."
              label="Location Deployed"
              margin="normal"
              name="candidateLocation"
              onChange={(e) => this.onChange(e)}
              required
              value={candidateLocation}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="overline" gutterBottom>
          <strong>Running Mate Information</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="runningMateName"
              helperText="Enter the full name of the running mate."
              label="Full Name"
              margin="normal"
              name="runningMateName"
              onChange={(e) => this.onChange(e)}
              required
              value={runningMateName}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <NumberFormat
              fullWidth
              id="runningMateAge"
              label="Age"
              margin="normal"
              name="runningMateAge"
              required
              value={runningMateAge}
              variant="filled"
              disabled={disabled}
              customInput={TextField}
              thousandSeparator
              isNumericString
              onValueChange={(values) => {
                this.onChange({
                  target: {
                    name: 'runningMateAge',
                    value: values.value,
                  },
                });
              }}
              format="##"
              mask="_"
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl margin="normal" fullWidth variant="filled" disabled={disabled}>
              <InputLabel id="select-gender">Gender</InputLabel>
              <Select 
                labelId="select-gender"
                id="runningMateGender"
                name="runningMateGender"
                onChange={(e) => this.onChange(e)}
                value={runningMateGender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="runningMateOrganization"
              helperText="Enter the full name of the organization. Avoid using abbreviations, unless absolutely necessary."
              label="Organization Deployed"
              margin="normal"
              name="runningMateOrganization"
              onChange={(e) => this.onChange(e)}
              required
              value={runningMateOrganization}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="runningMateLocation"
              helperText="Enter the full name of the location. Avoid using addreviations, unless absolutely necessary."
              label="Location Deployed"
              margin="normal"
              name="runningMateLocation"
              onChange={(e) => this.onChange(e)}
              required
              value={runningMateLocation}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Separator />

        <Typography variant="overline" gutterBottom>
          <strong>Team Slogan</strong>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              helperText={sloganError ? 'Your word count has exceded the limit of 100 characters.' : 'Your slogan in 100 characters or less.'}
              id="slogan"
              label="Campaign Slogan"
              margin="normal"
              name="slogan"
              onChange={(e) => this.onChange(e)}
              value={slogan}
              variant="filled"
              disabled={disabled}
              multiline
              rows={2}
              placeholder="Enter your team slogan if you have one..."
              error={sloganError}
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
          disabled={disabled || disableButton || sloganError}
        >
          Submit Candidacy Bid
        </Button>
      </form>
    );
  }
}

const SubmitBidForm = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(SubmitBidFormBase);

export default SubmitBidForm;
