import React, { Component } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { compose } from 'recompose';

import EditCampaignForm from './editCampaignForm';

import Separator from '../../../components/Separator';
import { Main as Sidebar } from '../../../components/Sidebar';

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

class EditCampaignBase extends Component {
  render() {
    const id = this.props.match.params.id; // Read id passed as URL parameter
    
    return(
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>

          <Paper elevation={0} square>
            <Box p={3}>
              <Typography align="center" variant="h4" gutterBottom>
                <strong>Edit Campaign</strong>
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
                <Link color="inherit" component={RouterLink} to={ROUTES.CAMPAIGNS}>
                  Election Campaigns
                </Link>
                <Typography color="textPrimary">Edit Campaign</Typography>
              </Breadcrumbs>
            </Box>
          </Paper>

          <Separator />

          {/* Edit Campaign Form */}
          <EditCampaignForm id={id} />

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

const EditCampaign = compose(
  withAuthorization(condition),
)(EditCampaignBase);

export default EditCampaign;

export { EditCampaignForm };