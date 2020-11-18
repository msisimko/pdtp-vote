import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import LabelIcon from '@material-ui/icons/Label';
import LabelOffIcon from '@material-ui/icons/LabelOff';

import { DateTime } from "luxon";

import { AuthUserContext } from '../../../session';

import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

class SingleCampaign extends Component {
  static contextType = AuthUserContext;

  render() {
    const{ campaign } = this.props;

    const authUser = this.context;

    /**
     * Calculate Status - Campaign Start, Bid Submissions, Voting, Campaign Stop 
    */

    // Get current DateTime
    const now = DateTime.local()
    
    // Initialize an empty object, status
    let status = {};

    if (now < DateTime.fromISO(campaign.campaignStartDateTime)) {
      status['message'] = `Campaign starts on ${DateTime.fromISO(campaign.campaignStartDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'text.disabled';
    } else if (now >= DateTime.fromISO(campaign.campaignStartDateTime) && now < DateTime.fromISO(campaign.bidSubmissionOpenDateTime)) {
      status['message'] = `Bid Submissions start on ${DateTime.fromISO(campaign.bidSubmissionOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'info.main';
      status['button'] = 'View Campaign';
    } else if (now >= DateTime.fromISO(campaign.bidSubmissionOpenDateTime) && now < DateTime.fromISO(campaign.bidSubmissionCloseDateTime)) {
      status['message'] = `Bid Submissions ongoing until ${DateTime.fromISO(campaign.bidSubmissionCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'success.main';
      status['button'] = 'Submit Bid';
    } else if (now >= DateTime.fromISO(campaign.bidSubmissionCloseDateTime) && now < DateTime.fromISO(campaign.votingOpenDateTime)) {
      status['message'] = `Bid Submissions closed. Voting starts on ${DateTime.fromISO(campaign.votingOpenDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'info.main';
      status['button'] = 'View Candidates';
    } else if (now >= DateTime.fromISO(campaign.votingOpenDateTime) && now < DateTime.fromISO(campaign.votingCloseDateTime)) {
      status['message'] = `Voting ongoing until ${DateTime.fromISO(campaign.votingCloseDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'success.main';
      status['button'] = 'Vote Now';
    } else if (now >= DateTime.fromISO(campaign.votingCloseDateTime) && now < DateTime.fromISO(campaign.campaignStopDateTime)) {
      status['message'] = `Voting closed. Results to be announced on ${DateTime.fromISO(campaign.campaignStopDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'error.main';
    } else if (now >= DateTime.fromISO(campaign.campaignStopDateTime)) {
      status['message'] = `Campaign ended on ${DateTime.fromISO(campaign.campaignStopDateTime).toLocaleString(DateTime.DATETIME_MED)}`;
      status['color'] = 'text.disabled';
      status['button'] = 'View Results';
    }

    return(
      <React.Fragment>
        <TableRow>
          {/* Featured or (!) icon */}
          <TableCell>
            {campaign.featured ? (
              <Tooltip title="Featured">
                <IconButton aria-label="Featured">
                  <LabelIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Not Featured">
                <IconButton aria-label="Not Featured">
                    <LabelOffIcon />
                </IconButton>
              </Tooltip>
            )}
          </TableCell>
          {/* Election Campaign Title */}
          <TableCell component="th" scope="row">{campaign.title}</TableCell>
          {/* Status */}
          <TableCell>
            <Box color={status.color}>
              <Typography variant="overline" gutterBottom>
                <strong>{status.message}</strong>
              </Typography>
            </Box>
          </TableCell>
          {/* Action button */}
          {status.button ? (
            <TableCell align="center">
              <Button size="small" component={Link} to={`${ROUTES.CAMPAIGN_VIEW}/${campaign.id}`}>{status.button}</Button>
            </TableCell>
          ) : (
            <TableCell />
          )}
          {/* Edit button */}
          {!!authUser.roles[ROLES.ADMINISTRATOR] && (
            <TableCell align="right">
              <Button size="small" component={Link} to={`${ROUTES.CAMPAIGN_EDIT}/${campaign.id}`}>Edit</Button>
            </TableCell>
          )}
        </TableRow>
      </React.Fragment>
    );
  }
}

export default SingleCampaign;