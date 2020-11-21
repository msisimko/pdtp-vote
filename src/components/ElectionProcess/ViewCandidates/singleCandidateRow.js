import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import AnnouncementIcon from '@material-ui/icons/Announcement';
import PersonIcon from '@material-ui/icons/Person';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

class SingleCandidateRow extends Component {
  render() {
    const { team } = this.props;

    return(
      <TableRow>

        {/* Candidate information */}
        <TableCell component="th" scope="row">
          <Box display="flex" justifyContent="center">
            <Box p={3}>
            <Avatar>
              <PersonIcon size="large" />
            </Avatar>
            </Box>
          </Box>
          <Box textAlign="center">
            <Typography variant="body1" gutterBottom>{team.candidateName}</Typography>
            <Typography style={{ textTransform: 'capitalize' }} variant="body2" gutterBottom>{team.candidateAge} &bull; {team.candidateGender}</Typography>
            <Typography variant="body2" gutterBottom>{team.candidateOrganization}</Typography>
            <Typography variant="body2" gutterBottom>{team.candidateLocation}</Typography>
          </Box>
        </TableCell>

        {/* Running mate information */}
        <TableCell>
          <Box display="flex" justifyContent="center">
            <Box p={3}>
            <Avatar>
              <PersonIcon size="large" />
            </Avatar>
            </Box>
          </Box>
          <Box textAlign="center">
              <Typography variant="body1" gutterBottom>{team.runningMateName}</Typography>
              <Typography style={{ textTransform: 'capitalize' }} variant="body2" gutterBottom>{team.runningMateAge} &bull; {team.runningMateGender}</Typography>
            <Typography variant="body2" gutterBottom>{team.runningMateOrganization}</Typography>
            <Typography variant="body2" gutterBottom>{team.runningMateLocation}</Typography>
          </Box>
        </TableCell>

        {/* Team slogan */}
        <TableCell align="center">
          <Tooltip title={team.slogan !== '' ? team.slogan : 'This team does not have a slogan.' } arrow>
            <IconButton aria-label="Slogan">
              {team.slogan !== '' ? (<AnnouncementIcon />) : (<SentimentVeryDissatisfiedIcon />)}
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }
}


export default SingleCandidateRow;
