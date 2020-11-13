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
  displayName: '',
};

class UpdateProfileBase extends Component {
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

    const { displayName } = this.state;
 
    this.props.firebase
      .doUpdateProfile(displayName)
      .then(() => {
        enqueueSnackbar("Your profile has been updated.", { variant: 'success', onClose: this.handleClose });
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

    const { displayName } = this.state;
 
    const isDisabled = displayName === '';
 
    return (
      <React.Fragment>
        <Typography align="center" variant="h4" gutterBottom>    
          <strong>Profile</strong>
        </Typography>

        <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
          <TextField
            fullWidth
            id="displayName"
            label="Display Name"
            margin="normal"
            name="displayName"
            onChange={(e) => this.onChange(e)}
            required
            value={displayName}
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
            Update My Profile
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

const UpdateProfile = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(UpdateProfileBase);
 
export default UpdateProfile;
