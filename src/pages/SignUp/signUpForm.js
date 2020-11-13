import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

import { withSnackbar } from 'notistack';

import { withFirebase } from '../../firebase';

import * as ROUTES from '../../constants/routes';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const INITIAL_STATE = {
  displayName: '',        // Only accepts PDTP Registration No. or Nationa I.D. No.
  email: '',
  passwordOne: '',
  passwordTwo: '',
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
 
  onChange(event) {
    /**
     * Check if event.target.name equals displayName
     */
    if (event.target.name === 'displayName') {
      /**
       * If event.target.name equals displayName, then transform to uppercase
       */
      let displayName = event.target.value;
      let upperDisplayName = displayName.toUpperCase();

      // Update displayName state only with newly transformed upperDisplayName
      this.setState({ displayName: upperDisplayName });
    } else {
      /**
       * If even.target.name does not equal displayName, update state immediately
       */
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  onSubmit(event) {
    const { enqueueSnackbar } = this.props;

    const { displayName, email, passwordOne } = this.state;

    /**
     * pdtpRegex  - Matches the PDTP Reg. No.
     * idRegex    - Matches the Kenyan National I.D. No.
     */
    const pdtpRegex = new RegExp('^PDTP[A-Z0-9_]{6}$');   // PDTP Registration No. regex
    const idRegex = new RegExp('^[0-9]{8}$');             // National I.D. No. regex

    /**
     * Check if displayName matches either the PDTP Reg. No. or National I.D. No.
     */
    if ( pdtpRegex.test(displayName) || idRegex.test(displayName) ) {
      /**
       * If displayName matches either regex expressions, then create user
       */
      this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(() => {
        return this.props.firebase.auth.currentUser
                .updateProfile({
                  displayName,
                });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error'});
      });
    } else {
      /**
       * If displayName does not match regex expressions, then enqueue error
       */
      enqueueSnackbar("Please enter either your PDTP Registration Number or National I.D. No.", { variant: 'error'});
    }

    event.preventDefault();
  }

  render() {
    const { classes } = this.props;

    const { displayName, email, passwordOne, passwordTwo } = this.state;

    const isDisabled =  displayName === '' ||
                        email === '' ||
                        passwordOne !== passwordTwo ||
                        passwordOne === '';

    return (
      <React.Fragment>
        <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
          <TextField
            fullWidth
            id="displayName"
            label="Voter Unique Identifier"
            helperText="Please use your PDTP Registration Number or National I.D. Number."
            margin="normal"
            name="displayName"
            onChange={(e) => this.onChange(e)}
            required
            value={displayName}
            variant="filled"
          />
          <TextField
            fullWidth
            id="email"
            helperText="You'll need to confirm that this email belongs to you."
            label="Email Address"
            margin="normal"
            name="email"
            onChange={(e) => this.onChange(e)}
            required
            value={email}
            variant="filled"
          />
          <TextField
            fullWidth
            id="passwordOne"
            helperText="Use 6 or more characters with a mix of letters, numbers &amp; symbols."
            label="Password"
            margin="normal"
            name="passwordOne"
            onChange={(e) => this.onChange(e)}
            required
            type="password"
            value={passwordOne}
            variant="filled"
          />
          <TextField
            fullWidth
            id="passwordTwo"
            label="Confirm Password"
            margin="normal"
            name="passwordTwo"
            onChange={(e) => this.onChange(e)}
            required
            type="password"
            value={passwordTwo}
            variant="filled"
          />
          <Button
            className={classes.submit}
            color="primary"
            disabled={isDisabled}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Sign Up
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

const SignUpForm = compose(
  withRouter,
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(SignUpFormBase);

export default SignUpForm;
