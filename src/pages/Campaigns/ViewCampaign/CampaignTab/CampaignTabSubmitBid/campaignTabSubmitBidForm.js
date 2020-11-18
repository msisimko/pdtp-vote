import React, { Component } from 'react';
import { compose } from 'recompose';

import Separator from '../../../../../components/Separator';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import { withSnackbar } from 'notistack';

import NumberFormat from 'react-number-format';
 
import { withFirebase } from '../../../../../firebase';

import { AuthUserContext } from '../../../../../session';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const INITIAL_STATE = {
  name: '',                   // Name of candidate
  age: '',                    // Age of candidate
  gender: '',                 // Gender of candidate
  organizationDeployed: '',   // Organization deployed
  locationDeployed: '',       // Location deployed
  manifesto: '',              // Candidate's manifesto
  confirmation: false,        // Checkbox to confirm that they understand that once they Submit their Bid, they cannot edit, change or update it
  submitted: false,           // Campaign Bid already submitted? - used to prevent posting of a bid already submitted : onSubmit() function
  disabled: true,            
}

class CampaignTabSubmitBidFormBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { id, enqueueSnackbar } = this.props;

    const authUser = this.context;

    this.props.firebase
      .candidate(id, authUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            name: doc.data().name,
            age: doc.data().age,
            gender: doc.data().gender,
            organizationDeployed: doc.data().organizationDeployed,
            locationDeployed: doc.data().locationDeployed,
            manifesto: doc.data().manifesto,
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

    const { name, age, gender, organizationDeployed, locationDeployed, manifesto, confirmation, submitted } = this.state;

    const authUser = this.context;

    this.setState({ disabled: true });
 
    /**
     * Using the state { submitted }, we can prevent unscrupulous users who bypass CSS 
     * measures from submitting their data regardless of the bypass. 
     */
    if (!submitted) {
      this.props.firebase
      .candidates(id)
      .doc(authUser.uid)
      .set({
        name,
        age: parseFloat(age),
        gender,
        organizationDeployed,
        locationDeployed,
        manifesto,
        confirmation,
        submitted: true,
        createdOn: this.props.firebase.getServerTimestamp(),
        createdBy: authUser.uid,
        createdByName: authUser.displayName,
      })
      .then(() => {
        enqueueSnackbar(`Your candidacy bid has been submitted successfully.`, { variant: 'success' });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error', onClose: this.handleError });
      });
    } else {
      enqueueSnackbar('You have already submitted your Candidacy Bid for this election', { variant: 'error' });
    }
    

    event.preventDefault();
  }

  handleError(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ disabled: false });
  }

  render() {
    const { classes } = this.props;

    const { name, age, gender, organizationDeployed, locationDeployed, manifesto, confirmation, disabled } = this.state;

    const disableButton = name === '' ||
                          age === '' ||
                          gender === '' ||
                          organizationDeployed === '' ||
                          locationDeployed === '' ||
                          confirmation === false;
    
    return(
      <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              helperText="Enter your full name to help voters uniquely identify you."
              label="Full Name"
              margin="normal"
              name="name"
              onChange={(e) => this.onChange(e)}
              required
              value={name}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <NumberFormat
              fullWidth
              id="age"
              label="Age"
              margin="normal"
              name="age"
              required
              value={age}
              variant="filled"
              disabled={disabled}
              customInput={TextField}
              thousandSeparator
              isNumericString
              onValueChange={(values) => {
                this.onChange({
                  target: {
                    name: 'age',
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
                id="gender"
                name="gender"
                onChange={(e) => this.onChange(e)}
                value={gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="organizationDeployed"
              helperText="Enter the full name of the organization. Please avoid using abbreviations, unless absolutely necessary."
              label="Organization Deployed"
              margin="normal"
              name="organizationDeployed"
              onChange={(e) => this.onChange(e)}
              required
              value={organizationDeployed}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="locationDeployed"
              helperText="Enter the full name of your location. Please avoid using addreviations, unless absolutely necessary."
              label="Location Deployed"
              margin="normal"
              name="locationDeployed"
              onChange={(e) => this.onChange(e)}
              required
              value={locationDeployed}
              variant="filled"
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="manifesto"
              label="Manifesto"
              margin="normal"
              name="manifesto"
              onChange={(e) => this.onChange(e)}
              value={manifesto}
              variant="filled"
              disabled={disabled}
              multiline
              rows={4}
              placeholder="Why should we vote for you?"
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
              label="I confirm that I have VERIFIED the information I have submitted and understand that once I have submitted my Candidacy Bid I CANNOT edit it."
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
          Submit Bid
        </Button>
      </form>
    );
  }
}

const CampaignTabSubmitBidForm = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(CampaignTabSubmitBidFormBase);

export default CampaignTabSubmitBidForm;
