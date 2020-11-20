import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import ResetPasswordForm from './resetPasswordForm';

import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withFirebase } from '../../../firebase';

import { AuthUserContext } from '../../../session';

import * as ROUTES from '../../../constants/routes';

const INITIAL_STATE = {
  isLoading: true,
  error: null,
};

class ResetPasswordBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    let authUser = this.context;

    if (authUser) {
      // If signed in, redirect to Account
      this.props.history.push(ROUTES.SETTINGS);
    } else {
      const { actionCode } = this.props;
  
      this.props.firebase
        .doVerifyPasswordResetCode(actionCode)
        .catch(error => {
          this.setState({ error });
        })
        .then(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  render() {
    const { actionCode } = this.props;

    const { isLoading, error } = this.state;

    const success = !isLoading && !error;

    return(
      <React.Fragment>
        <Paper elevation={0} square>
          {isLoading &&
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>    
                <strong>Password Reset</strong>
              </Typography>

              <LinearProgress color="primary" />
            </Box>
          }

          {error &&
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>    
                <strong>Password Reset</strong>
              </Typography>

              <Typography align="center" variant="body2" gutterBottom>
                {error.message}
              </Typography>
            </Box>
          }
        </Paper>

        {success &&
          // Reset password form 
          <ResetPasswordForm actionCode={actionCode} />
        }
      </React.Fragment>
    );
  }
}

const ResetPassword = compose(
  withRouter,
  withFirebase,
)(ResetPasswordBase);

export default ResetPassword;
