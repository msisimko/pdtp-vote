import React, { Component } from 'react';
import { compose } from 'recompose';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import { withStyles } from '@material-ui/core/styles';

import AdjustIcon from '@material-ui/icons/Adjust';
import AvTimerIcon from '@material-ui/icons/AvTimer';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

import { AuthUserContext } from '../../../session';

const styles = theme => ({
  table: {
    minWidth: 275,
  },
});

const INITIAL_STATE = {
  allElections: [],
}

class ListElectionsBase extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };

    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.listener = this.props.firebase
                      .elections()
                      .orderBy('createdOn', 'desc')
                      .limit(10)
                      .onSnapshot((querySnapshot) => {
                        let allElections = [];
                        querySnapshot.forEach((doc) => {
                          allElections.push({ id: doc.id, title: doc.data().title, status: doc.data().status, createdBy: doc.data().createdBy });
                        });
                        this.setState({ allElections });
                      });
  }

  componentWillUnmount() {
    this.listener();
  }

  handleDelete(election) {
    const { enqueueSnackbar } = this.props;

    this.props.firebase
      .election(election.id)
      .delete()
      .then(() => {
        enqueueSnackbar(`${election.title} has been deleted successfully.`, { variant: 'success' });
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  };

  render() {
    const { classes } = this.props;

    const { allElections } = this.state;
    
    const authUser = this.context;

    return(
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
                {allElections.length === 0 ? (
                  <TableBody>
                    <TableRow key={0}>
                      <TableCell>
                        <Box color="text.disabled">There are currently no Election Campaigns in the database.</Box>
                      </TableCell>
                    </TableRow>  
                  </TableBody>
                ) : (
                  <React.Fragment>
                    <caption>A list of the 10 most recent Election Campaigns. </caption>
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={3}>Campaign Title</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {allElections.map((election) => (
                        <TableRow key={election.id} hover>
                          <TableCell>
                            {election.title}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {election.status === 1 ?  (
                              <Tooltip title="Ongoing">
                                <IconButton aria-label="Ongoing">
                                  <Box color="success.main">
                                    <AdjustIcon fontSize="small" />
                                  </Box>
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Upcoming">
                                <IconButton aria-label="Upcoming">
                                  <Box color="warning.main">
                                    <AvTimerIcon fontSize="small" />
                                  </Box>
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Button size="small" onClick={() => this.handleDelete(election)} disabled={authUser.uid !== election.createdBy}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </React.Fragment>
                )}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  }
}

const ListElections = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(ListElectionsBase);

export default ListElections;
