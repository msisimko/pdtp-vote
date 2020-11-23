import React, { Component } from 'react';

import { SignInLink } from '../../components/SignIn';
import { SignUpLink } from '../../components/SignUp';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import { AuthUserContext } from '../../session';

import * as ROUTES from '../../constants/routes';

import { ReactComponent as VotingImage } from '../../assets/voting_monochromatic.svg';

class Landing extends Component {
  static contextType = AuthUserContext;
  
  componentDidMount() {
    // If signed in, redirect to Home
    let authUser = this.context;
    authUser && this.props.history.push(ROUTES.HOME);
  }

  render() {
    return(
      <React.Fragment>

        <Paper elevation={0} square>
          <Box p={3} color="primary.main">
            <Typography align="center" variant="h4" gutterBottom>
              <strong>PDTP KURA</strong>
            </Typography>
            <Typography align="center" variant="body2" gutterBottom>
              An in-house crafted, fully-featured Election Management System.
            </Typography>
          </Box>
        </Paper>
        
        <Paper elevation={0} square>
          <Box p={3} display="flex" justifyContent="center">
            <Box>
              <SvgIcon component={VotingImage} viewBox="0 0 399 399" style={{ fontSize: 300 }} />
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} square>
          <Box p={3} color="text.secondary">
            <Typography align="center" variant="body1" gutterBottom>
              Sign in to vote.
            </Typography>
          </Box>
        </Paper>

        <Paper elevation={0} square>
          <Box display="flex" justifyContent="center">
            <Box p={2} color="text.secondary">
              <SignInLink />
            </Box>
            <Box p={2} color="text.secondary">
              <SignUpLink />
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} square>
          <Box p={3} display="flex" justifyContent="center" color="text.disabled">
            <Box>
              <Typography variant="caption" gutterBottom>
                This project was made possible through The Presidential Digital Talent Programme.
              </Typography>
            </Box>
          </Box>
        </Paper>

      </React.Fragment>
    );
  }
}

export default Landing;
