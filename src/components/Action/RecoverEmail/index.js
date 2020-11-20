import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Separator } from '../../../components/Separator';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withFirebase } from '../../../firebase';

import * as ROUTES from '../../../constants/routes';

const INITIAL_STATE = {
  isLoading: true,
  error: null,
};

class RecoverEmail extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { actionCode } = this.props;

    this.props.firebase
      .doCheckActionCode(actionCode)
      .then(() => {
        return this.props.firebase.doApplyActionCode(actionCode);
      })
      .catch(error => {
        this.setState({ error });
      })
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { isLoading, error } = this.state;

    const success = !isLoading && !error;

    return(
      <React.Fragment>
        <Paper elevation={0} square>
          <Box p={3}>
            <Typography align="center" variant="h4" gutterBottom>
              <strong>Email Recovery</strong>
            </Typography>
            
            {isLoading &&
              <LinearProgress color="primary" />
            }

            {success &&
              <Typography align="center" variant="body2" gutterBottom>
                The request to change your email address has been revoked successfully.
              </Typography>
            }

            {error &&
              <Typography align="center" variant="body2" gutterBottom>
                {error.message}
              </Typography>
            }
          </Box>
        </Paper>

        <Separator />
          
        {success &&
          <Paper elevation={0} square>
            <Box p={3}>
              <Button fullWidth size="large" color="primary" component={RouterLink} to={ROUTES.LANDING}>
                Continue
              </Button>
            </Box>
          </Paper>
        }
      </React.Fragment>
    );
  }
}

export default withFirebase(RecoverEmail);
