import React, { Component } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { compose } from 'recompose';

import CampaignTab from './CampaignTab';

import Separator from '../../../components/Separator';
import { Main as Sidebar } from '../../../components/Sidebar';

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { withAuthorization, withEmailVerification } from '../../../session';

import * as ROUTES from '../../../constants/routes';

class ViewCampaignBase extends Component {
  render() {
    const id = this.props.match.params.id;
    const tab = this.props.match.params.tab;

    return(
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          
          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>View Campaign</strong>
              </Typography>
              <Typography align="center" variant="body2" gutterBottom>
                This page is only accessible to logged in users.
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
                <Link color="inherit" component={RouterLink} to={ROUTES.CAMPAIGNS}>
                  Election Campaigns
                </Link>
                <Typography color="textPrimary">View Campaign</Typography>
              </Breadcrumbs>
            </Box>
          </Paper>

          <Separator />

          {/* Campaign Tab */}
          <CampaignTab id={id} tab={tab} />

        </Grid>
        <Grid item md={4} xs={12}>

          <Sidebar />

        </Grid>
      </Grid>
    );
  }
}

const condition = authUser => !!authUser;

const ViewCampaign = compose(
  withAuthorization(condition),
  withEmailVerification,
)(ViewCampaignBase);

export default ViewCampaign;

export { CampaignTab };
