import React, { Component } from 'react';
import { compose } from 'recompose';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

import { withSnackbar } from 'notistack';

import { withFirebase } from '../../firebase';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const INITIAL_STATE = {
  email: '',
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
  
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  
  onSubmit(event) {
    const { enqueueSnackbar } = this.props;
    
    const { email } = this.state;
  
    this.props.firebase
      .doSendPasswordResetEmail(email)
      .then(() => {
        enqueueSnackbar("Please check your inbox for a password reset email.", { variant: 'success', onClose: this.handleClose });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  
    event.preventDefault();
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ ...INITIAL_STATE });
  }
  
  render() {
    const { classes } = this.props;
    
    const { email } = this.state;

    const isDisabled = email === '';
  
    return (
      <React.Fragment>
        <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
          <TextField
            fullWidth
            id="email"
            label="Email Address"
            margin="normal"
            name="email"
            onChange={(e) => this.onChange(e)}
            required
            value={email}
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
            Reset My Password
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

const PasswordForgetForm = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(PasswordForgetFormBase);
 
export default PasswordForgetForm;
