/**
 * TO-DO:  Introduce a way to LOAD ALL the elections available in the
 *         database, and PAGINATE the elections loaded on this page,
 *         as well as allow FILTER the elections using: upcoming, ongoing, ended.
 *         Also, allow the table to be SORTED using the dates available.
 */

import React, { Component } from 'react';
import { compose } from 'recompose';

import SingleElectionRow from './singleElectionRow';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import LabelImportantIcon from '@material-ui/icons/LabelImportant';

import Skeleton from '@material-ui/lab/Skeleton';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

import { AuthUserContext } from '../../../session';

import * as ROLES from '../../../constants/roles';

const INITIAL_STATE = {
  allElections: [],
  loading: true,
}

class ListElectionsBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { enqueueSnackbar } = this.props;

    this.listener = this.props.firebase
                      .elections()
                      .orderBy('createdOn', 'desc')
                      .limit(10)
                      .onSnapshot((querySnapshot) => {
                        let allElections = [];
                        querySnapshot.forEach((doc) => {
                          allElections.push({ 
                            id: doc.id,
                            title: doc.data().title,
                            description: doc.data().description,
                            featured: doc.data().featured,
                            electionStartDateTime: doc.data().electionStartDateTime,
                            electionStopDateTime: doc.data().electionStopDateTime,
                            bidSubmissionStartDateTime: doc.data().bidSubmissionStartDateTime,
                            bidSubmissionStopDateTime: doc.data().bidSubmissionStopDateTime,
                            votingStartDateTime: doc.data().votingStartDateTime,
                            votingStopDateTime: doc.data().votingStopDateTime,
                            createdBy: doc.data().createdBy,
                            createdByName: doc.data().createdByName,
                          });
                        });

                        this.setState({ 
                          allElections,
                          loading: false,
                        });

                      }, (error) => {
                        enqueueSnackbar(error.message, { variant: 'error' });
                      });
  }

  componentWillUnmount() {
    this.listener();
  }
  
  render() {
    const { allElections, loading } = this.state;

    const authUser = this.context;
    
    return(
      <TableContainer component={Paper} elevation={0} square>
        <Table aria-label="Elections">
          {loading ? (
            <caption><Skeleton variant="text" /></caption>
          ) : (
            <React.Fragment>
              {allElections.length === 0 ? (
                <caption>There are currently no elections in the database.</caption>
              ) : (
                <React.Fragment>
                  <caption>A list of the 10 most recent elections. </caption>
                  <TableHead>
                    <TableRow>
                      {/* Featured or (!) icon */}
                      <TableCell align="center">
                        <Tooltip title="Homepage Status">
                          <IconButton aria-label="Homepage Status">
                              <LabelImportantIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      {/* Election title */}
                      <TableCell>Election Title</TableCell>
                      {/* Status */}
                      <TableCell>Election Status</TableCell>
                      {/* View button */}
                      <TableCell />
                      {/*Edit button */}
                      {!!authUser.roles[ROLES.ADMINISTRATOR] && (
                        <TableCell align="center">Edit</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allElections.map((election) => (
                      <SingleElectionRow key={election.id} election={election} />
                    ))}
                  </TableBody>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
            
        </Table>
      </TableContainer>
    );
  }
}

const ListElections = compose(
  withSnackbar,
  withFirebase,
)(ListElectionsBase);

export default ListElections;
