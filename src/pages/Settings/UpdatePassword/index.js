import React, { Component } from 'react';
import { compose } from 'recompose';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

const styles = theme => ({
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
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
  disabled: false,
};

class UpdatePasswordBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }
 
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    const { enqueueSnackbar } = this.props;

    const { passwordOne } = this.state;

    this.setState({ disabled: true });
 
    this.props.firebase
      .doUpdatePassword(passwordOne)
      .then(() => {
        enqueueSnackbar("Your password has been updated.", { variant: 'success', onClose: this.handleSuccess });
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

    const { passwordOne, passwordTwo, disabled } = this.state;

    const disableButton = passwordOne !== passwordTwo ||
                      passwordOne === '';
 
    return (
      <Accordion elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
          <Box p={1}>
            <Typography className={classes.heading} variant="h6">Password</Typography>
            <Typography className={classes.secondaryHeading} variant="subtitle1">Change your password.</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              
              <form className={classes.form} onSubmit={(e) => this.onSubmit(e)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                  disabled={disabled || disableButton}
                >
                  Update My Password
                </Button>
              </form>
              
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

const UpdatePassword = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(UpdatePasswordBase);
 
export default withFirebase(UpdatePassword);
