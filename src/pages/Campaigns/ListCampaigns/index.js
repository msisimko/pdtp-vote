/**
 * FUTURE:  Introduce a way to PAGINATE the results collected on this page,
 *          as well as allow FILTERING using: upcoming, ongoing, ended.
 *          Also, allow the table to be SORTED using: title
 */

import React, { Component } from 'react';
import { compose } from 'recompose';

import SingleCampaign from './singleCampaign';

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

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

const INITIAL_STATE = {
  allCampaigns: [],
}

class ListCampaignsBase extends Component {
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
                        let allCampaigns = [];
                        querySnapshot.forEach((doc) => {
                          allCampaigns.push({ 
                            id: doc.id,
                            title: doc.data().title,
                            description: doc.data().description,
                            featured: doc.data().featured,
                            campaignStartDateTime: doc.data().campaignStartDateTime,
                            campaignStopDateTime: doc.data().campaignStopDateTime,
                            bidSubmissionOpenDateTime: doc.data().bidSubmissionOpenDateTime,
                            bidSubmissionCloseDateTime: doc.data().bidSubmissionCloseDateTime,
                            votingOpenDateTime: doc.data().votingOpenDateTime,
                            votingCloseDateTime: doc.data().votingCloseDateTime,
                            createdBy: doc.data().createdBy,
                            createdByName: doc.data().createdByName,
                          });
                        });
                        this.setState({ allCampaigns });
                      }, (error) => {
                        enqueueSnackbar(error.message, { variant: 'error' });
                      });
  }

  componentWillUnmount() {
    this.listener();
  }
  
  render() {
    const { allCampaigns } = this.state;
    
    return(
      <TableContainer component={Paper} elevation={0} square>
        <Table aria-label="Election Campaigns">
          {allCampaigns.length === 0 ? (
            <caption>There are currently no Election Campaigns in the database.</caption>
          ) : (
            <React.Fragment>
              <caption>A list of the 10 most recent Election Campaigns. </caption>
              <TableHead>
                <TableRow>
                  {/* Featured or (!) icon */}
                  <TableCell>
                    <Tooltip title="Homepage Status">
                      <IconButton aria-label="Homepage Status">
                          <LabelImportantIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  {/* Election Campaign Title */}
                  <TableCell>Campaign Title</TableCell>
                  {/* Status */}
                  <TableCell>Campaign Status</TableCell>
                  {/* Action button */}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {allCampaigns.map((campaign) => (
                  <SingleCampaign key={campaign.id} campaign={campaign} />
                ))}
              </TableBody>
            </React.Fragment>
          )}
        </Table>
      </TableContainer>
    );
  }
}

const ListCampaigns = compose(
  withSnackbar,
  withFirebase,
)(ListCampaignsBase);

export default ListCampaigns;

export { SingleCampaign };
