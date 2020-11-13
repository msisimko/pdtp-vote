import React, { Component } from 'react';

import RecoverEmail from './RecoverEmail';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';

import { Actions as Sidebar} from '../../components/Sidebar';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const INITIAL_STATE = {
  mode: null,
  oobCode: null,
};

class Action extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
  
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    this.setState({
      mode: query.get('mode'),
      oobCode: query.get('oobCode'),
    });
  }

  render() {
    const { mode, oobCode } = this.state;

    switch (mode) {
      case 'recoverEmail':
        return (
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <RecoverEmail actionCode={oobCode} />
            </Grid>
            <Grid item md={4} xs={12}>
              <Sidebar />
            </Grid>
          </Grid>
        );
      case 'resetPassword':
        return (
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <ResetPassword actionCode={oobCode} />
            </Grid>
            <Grid item md={4} xs={12}>
              <Sidebar />
            </Grid>
          </Grid>
        );
      case 'verifyEmail':
        return (
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <VerifyEmail actionCode={oobCode} />
            </Grid>
            <Grid item md={4} xs={12}>
              <Sidebar />
            </Grid>
          </Grid>
        );
      default:
        return(
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              
              <Paper elevation={0} square>
                <Box p={3}>
                  <Typography align="center" variant="h4" gutterBottom>
                    <strong>Oops...</strong>
                  </Typography>
                  <Typography align="center" variant="body2" gutterBottom>
                    Invalid action.
                  </Typography>
                </Box>
              </Paper>
              
            </Grid>
            <Grid item md={4} xs={12}>
              
              <Sidebar />

            </Grid>
          </Grid>          
        );
    }
  }
}

export default Action;

export { RecoverEmail, ResetPassword, VerifyEmail };