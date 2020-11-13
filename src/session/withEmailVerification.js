import React from 'react';
import { compose } from 'recompose';

import AuthUserContext from './context';

import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import { withFirebase } from '../firebase';

const styles = theme => ({
  button: {
    margin: theme.spacing(3, 0, 2),
  },
});

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false, error: null };
  
      this.onSendEmailVerification = this.onSendEmailVerification.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }

    onSendEmailVerification() {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }))
        .catch(error => {
          this.setState({ error });
        });
    }

    handleClose(event, reason) {
      if (reason === 'clickaway') {
        return;
      }

      this.setState({ error: null });
    }

    render() {
      const { classes } = this.props;

      const { isSent, error } = this.state;

      const isError = error !== null;

      return(
        <AuthUserContext.Consumer>
          {authUser => 
            needsEmailVerification(authUser) ? (
              <React.Fragment>
                <Container maxWidth="sm">
                  <Box py={3}>
                    <Paper elevation={0}>
                      <Box px={3} pt={3}>
                        <Typography align="center" variant="h4">    
                          <strong>Email Verification</strong>
                        </Typography>
                      </Box>

                      {isSent ? (
                        <Box p={3}>
                          <Typography align="center" variant="subtitle1" gutterBottom>
                            E-Mail Confirmation Sent
                          </Typography>
                          <Typography align="center" variant="body2" gutterBottom>
                            Check you E-Mails (Spam folder included) for a confirmation E-Mail.
                          </Typography>
                        </Box>
                      ) : (
                        <Box p={3}>
                          <Typography align="center" variant="subtitle1" gutterBottom>
                            Verify Your E-Mail
                          </Typography>
                          <Typography align="center" variant="body2" gutterBottom>
                            Check you E-Mails (Spam folder included) for a confirmation E-Mail.
                          </Typography>
                          <Typography align="center" variant="body2" gutterBottom>
                            Refresh this page if you have already confirmed your E-Mail.
                          </Typography>
                          <Button
                            className={classes.button}
                            color="primary"
                            disabled={isSent}
                            fullWidth
                            onClick={this.onSendEmailVerification}
                            size="large"
                            type="button"
                            variant="contained"
                          >
                            Send Confirmation E-Mail
                          </Button>
                        </Box>
                      )}

                    </Paper>
                  </Box>
                </Container>

                {error &&
                  <Snackbar open={isError} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert elevation={6} variant="filled" onClose={this.handleClose} severity="error">
                      {error.message}
                    </Alert>
                  </Snackbar>
                }
              </React.Fragment>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  
  return compose(
    withStyles(styles, { withTheme: true }),
    withFirebase,
  )(WithEmailVerification);
}

export default withEmailVerification;
