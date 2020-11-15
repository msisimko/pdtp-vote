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

import LabelIcon from '@material-ui/icons/Label';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import LabelOffIcon from '@material-ui/icons/LabelOff';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

import { AuthUserContext } from '../../../session';

const styles = theme => ({
  table: {
    minWidth: 275,
  },
});

const INITIAL_STATE = {
  allCampaigns: [],
}

class AddCampaignListBase extends Component {
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
                      .limit(5)
                      .onSnapshot((querySnapshot) => {
                        let allCampaigns = [];
                        querySnapshot.forEach((doc) => {
                          allCampaigns.push({ id: doc.id, title: doc.data().title, featured: doc.data().featured, createdBy: doc.data().createdBy });
                        });
                        this.setState({ allCampaigns });
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

    const { allCampaigns } = this.state;
    
    const authUser = this.context;

    return(
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
                {allCampaigns.length === 0 ? (
                  <TableBody>
                    <TableRow key={0}>
                      <TableCell>
                        <Box color="text.disabled">There are currently no Election Campaigns in the database.</Box>
                      </TableCell>
                    </TableRow>  
                  </TableBody>
                ) : (
                  <React.Fragment>
                    <caption>A list of the 5 most recent Election Campaigns. </caption>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Tooltip title="Homepage Status">
                            <IconButton aria-label="Homepage Status">
                                <LabelImportantIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>Campaign Title</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {allCampaigns.map((election) => (
                        <TableRow key={election.id} hover>
                          <TableCell component="th" scope="row">
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
                          <TableCell>
                            {election.title}
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

const AddCampaignList = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(AddCampaignListBase);

export default AddCampaignList;
