import React, { Component } from 'react';
import { Link as RouterLink } from "react-router-dom";

import { EditElection } from '../../../components/Elections';
import { Separator } from '../../../components/Separator';
import { MainSidebar as Sidebar } from '../../../components/Sidebars';

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { withAuthorization } from '../../../session';

import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

class ElectionEdit extends Component {
  render() {
    const electionId = this.props.match.params.id; // Read id passed as URL parameter
    
    return(
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>

          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>Edit Election</strong>
              </Typography>
              <Typography align="center" variant="body2" gutterBottom>
                This page is only accessible to administrators.
              </Typography>
            </Box>
          </Paper>

          <Separator />

          <Paper elevation={0} square>
            <Box display="flex" justifyContent="center" p={3}>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="Breadcrumb">
                <Link color="inherit" component={RouterLink} to={ROUTES.HOME}>
                  Home
                </Link>
                <Link color="inherit" component={RouterLink} to={ROUTES.ELECTIONS}>
                  Elections
                </Link>
                <Typography color="textPrimary">Edit Election</Typography>
              </Breadcrumbs>
            </Box>
          </Paper>

          <Separator />

          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h5" gutterBottom>
                <strong>Election Settings</strong>
              </Typography>
            </Box>
          </Paper>

          {/* Edit Election */}
          <EditElection electionId={electionId} />

        </Grid>
        <Grid item md={4} xs={12}>

          <Sidebar />

        </Grid>
      </Grid>
    );
  }
}


const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMINISTRATOR];

export default withAuthorization(condition)(ElectionEdit);
