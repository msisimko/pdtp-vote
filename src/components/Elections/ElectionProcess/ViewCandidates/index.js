import React, { Component } from 'react';
import { compose } from 'recompose';

import SingleCandidateRow from './singleCandidateRow';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Skeleton from '@material-ui/lab/Skeleton';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../../firebase';

const styles = theme => ({
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
});

const INITIAL_STATE = {
  teams: [],
  loading: true,
}

class ViewCandidatesBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { electionId, enqueueSnackbar } = this.props;

    this.props.firebase
      .candidates(electionId)
      .get()
      .then((querySnapshot) => {
        
        let teams = [];

        querySnapshot.forEach((doc) => {
          teams.push({
            id: doc.id,
            candidateName: doc.data().candidateName,
            candidateAge: doc.data().candidateAge,
            candidateGender: doc.data().candidateGender,
            candidateOrganization: doc.data().candidateOrganization,
            candidateLocation: doc.data().candidateLocation,
            runningMateName: doc.data().runningMateName,
            runningMateAge: doc.data().runningMateAge,
            runningMateGender: doc.data().runningMateGender,
            runningMateOrganization: doc.data().runningMateOrganization,
            runningMateLocation: doc.data().runningMateLocation,
            slogan: doc.data().slogan,
          });
        });

        this.setState({ 
          teams,
          loading: false,
        });

      }, (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { classes } = this.props;

    const { teams, loading } = this.state;

    return(
      <Accordion defaultExpanded elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box p={1} width="100%">
            <Typography className={classes.heading} variant="h6">View Candidates</Typography>
            <Typography className={classes.secondaryHeading} variant="subtitle1">Meet the contestants.</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              
              <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                  {loading ? (
                    <caption style={{ padding: 0 }}><Skeleton variant="text" /></caption>
                  ) : (
                    <React.Fragment>
                      {teams.length === 0 ? (
                        <caption style={{ padding: 0 }}>There are no candidates participating in this election.</caption>
                      ) : (
                        <React.Fragment>
                          <caption>A list of all the candidates &amp; their running mates participating in this election.</caption>
                          <TableHead>
                            <TableRow>
                              <TableCell align="center"><strong>Candidate</strong></TableCell>
                              <TableCell align="center"><strong>Running Mate</strong></TableCell>
                              <TableCell align="center"><strong>Slogan</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {teams.map((team) => (
                              <SingleCandidateRow key={team.id} team={team} />
                            ))}
                          </TableBody>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </Table>
              </TableContainer>
              
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

const ViewCandidates = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(ViewCandidatesBase);

export default ViewCandidates;
