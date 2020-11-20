import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Link from '@material-ui/core/Link';

import Typography from '@material-ui/core/Typography';

import * as ROUTES from '../../constants/routes';

class SignInLink extends Component {
  render() {
    return(
      <Typography variant="body2" gutterBottom>
        Already have an account? <Link component={RouterLink} to={ROUTES.SIGN_IN}>Sign In</Link>
      </Typography>
    );
  }
}

export default SignInLink;
