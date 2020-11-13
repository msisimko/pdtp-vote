import React, { Component } from 'react';

import SignInForm from './signInForm';
import SignInLink from './signInLink';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';

import { Authentication as Sidebar } from '../../components/Sidebar';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { AuthUserContext } from '../../session';

import * as ROUTES from '../../constants/routes';

class SignIn extends Component {
  static contextType = AuthUserContext;
  
  componentDidMount() {
    // If signed in, redirect to Home
    let authUser = this.context;
    authUser && this.props.history.push(ROUTES.HOME);
  }

  render() {
    return(
      <Grid container spacing={2}>
        
        <Hidden smDown>
          <Grid item md={6} xs={12}>

            <Sidebar />

          </Grid>
        </Hidden>

        <Grid item md={6} xs={12}>

          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>    
                <strong>Log In</strong>
              </Typography>

              {/* Sign in form */}
              <SignInForm />
              
              {/* Sign up link */}
              <SignUpLink />
              
              {/* Password forget link */}
              <PasswordForgetLink />
            </Box>
          </Paper>

        </Grid>

        <Hidden mdUp>
          <Grid item md={6} xs={12}>

            <Sidebar />

          </Grid>
        </Hidden>

      </Grid>
    )
  }
}
 
export default SignIn;

export { SignInForm, SignInLink };
