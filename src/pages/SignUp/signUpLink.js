import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Link from '@material-ui/core/Link';

import Typography from '@material-ui/core/Typography';

import * as ROUTES from '../../constants/routes';

class SignUpLink extends Component {
  render() {
    return(
      <Typography variant="body2" gutterBottom>
        Don't have an account? <Link component={RouterLink} to={ROUTES.SIGN_UP}>Sign Up</Link>
      </Typography>
    );
  }
}

export default SignUpLink;
