import React, { Component } from 'react';
import { compose } from 'recompose';

import { Separator } from '../../components/Separator';
import { MainSidebar as Sidebar } from '../../components/Sidebars';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import PersonIcon from '@material-ui/icons/Person';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../../session';

class AccountBase extends Component {
  render() {
    return(
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          
          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>Account</strong>
              </Typography>
              <Typography align="center" variant="body2" gutterBottom>
                This page is only accessible to logged in users.
              </Typography>
            </Box>
          </Paper>

          <Separator />
            
          <Paper elevation={0} square>
            <Box p={3}>
              <AuthUserContext.Consumer>
                { authUser => authUser &&
                  <React.Fragment>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="center">
                          <Box>
                            {authUser.photoURL ? (
                              <Avatar style={{ width: '100px', height: '100px'}} alt={authUser.displayName} src={authUser.photoURL} />
                            ) : (
                              <Avatar style={{ width: '100px', height: '100px'}}>
                                <PersonIcon style={{ fontSize: 60 }} />
                              </Avatar>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography align="center" variant="h4" gutterBottom>
                          <strong>{authUser.displayName}</strong>
                        </Typography>
                        <Typography align="center" variant="h6" gutterBottom>
                          <strong>{authUser.email}</strong>
                        </Typography>
                        {authUser.emailVerified ? (
                          <Typography align="center" variant="body2" gutterBottom>
                            Your email address is verified.
                          </Typography>
                        ) : (
                          <Typography align="center" variant="body2" gutterBottom>
                            Please verify your email address.
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </React.Fragment>
                }
              </AuthUserContext.Consumer>
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

const condition = authUser => !!authUser;

const Account = compose(
  withAuthorization(condition),
  withEmailVerification,
)(AccountBase);

export default Account;
