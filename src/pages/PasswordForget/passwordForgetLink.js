import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import * as ROUTES from '../../constants/routes';

class PasswordForgetLink extends Component {
  render() {
    return(
      <Typography variant="body2" gutterBottom>
        <Link component={RouterLink} to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
      </Typography>
    );
  }
}

export default PasswordForgetLink;
