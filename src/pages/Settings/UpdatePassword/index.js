import React, { Component } from 'react';
import { compose } from 'recompose';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
};

class UpdatePasswordBase extends Component {
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

    const { passwordOne } = this.state;
 
    this.props.firebase
      .doUpdatePassword(passwordOne)
      .then(() => {
        enqueueSnackbar("Your password has been updated.", { variant: 'success', onClose: this.handleClose });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error'});
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

    const { passwordOne, passwordTwo } = this.state;

    const isDisabled = passwordOne !== passwordTwo ||
                      passwordOne === '';
 
    return (
      <React.Fragment>
        <Typography align="center" variant="h4" gutterBottom>    
          <strong>Password</strong>
        </Typography>
        
        <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
          <TextField
            fullWidth
            id="passwordOne"
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
            Update My Password
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

const UpdatePassword = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(UpdatePasswordBase);
 
export default withFirebase(UpdatePassword);
