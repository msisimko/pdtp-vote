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

class SingleElectionRow extends Component {
  static contextType = AuthUserContext;

  render() {
    const{ election } = this.props;

    const authUser = this.context;

    /**
     * Calculate Status - Election Start, Bid Submissions Start & Stop, Voting Start & Stop, Election Stop 
    */

    // Get current DateTime
    const now = DateTime.local()
    
    // Initialize an empty object, status
    let status = {};

    if (now < DateTime.fromISO(election.electionStartDateTime)) {
      status['message'] = `Election starts on ${DateTime.fromISO(election.electionStartDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'text.disabled';
    } else if (now >= DateTime.fromISO(election.electionStartDateTime) && now < DateTime.fromISO(election.bidSubmissionStartDateTime)) {
      status['message'] = `Bid Submission starts on ${DateTime.fromISO(election.bidSubmissionStartDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'info.main';
    } else if (now >= DateTime.fromISO(election.bidSubmissionStartDateTime) && now < DateTime.fromISO(election.bidSubmissionStopDateTime)) {
      status['message'] = `Bid Submission ongoing until ${DateTime.fromISO(election.bidSubmissionStopDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'success.main';
    } else if (now >= DateTime.fromISO(election.bidSubmissionStopDateTime) && now < DateTime.fromISO(election.votingStartDateTime)) {
      status['message'] = `Voting starts on ${DateTime.fromISO(election.votingStartDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'info.main';
    } else if (now >= DateTime.fromISO(election.votingStartDateTime) && now < DateTime.fromISO(election.votingStopDateTime)) {
      status['message'] = `Voting ongoing until ${DateTime.fromISO(election.votingStopDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'success.main';
    } else if (now >= DateTime.fromISO(election.votingStopDateTime) && now < DateTime.fromISO(election.electionStopDateTime)) {
      status['message'] = `Results to be announced on ${DateTime.fromISO(election.electionStopDateTime).toLocaleString(DateTime.DATETIME_MED)}.`;
      status['color'] = 'error.main';
    } else if (now >= DateTime.fromISO(election.electionStopDateTime)) {
      status['message'] = 'Results are out.';
      status['color'] = 'success.main';
    }

    return(
      <React.Fragment>
        <TableRow>
          {/* Featured or (!) icon */}
          <TableCell align="center">
            {election.featured ? (
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
          {/* Election title */}
          <TableCell component="th" scope="row">{election.title}</TableCell>
          {/* Election status */}
          <TableCell>
            <Box color={status.color}>
              <Typography variant="overline" gutterBottom>
                <strong>{status.message}</strong>
              </Typography>
            </Box>
          </TableCell>
          {/* Action button */}
          <TableCell align="center">
            <Button size="small" component={Link} to={`${ROUTES.ELECTION_VIEW}/${election.id}`}>View</Button>
          </TableCell>
          {/* Edit button */}
          {!!authUser.roles[ROLES.ADMINISTRATOR] && (
            <TableCell align="center">
              <Button size="small" component={Link} to={`${ROUTES.ELECTION_EDIT}/${election.id}`}>Edit</Button>
            </TableCell>
          )}
        </TableRow>
      </React.Fragment>
    );
  }
}

export default SingleElectionRow;
