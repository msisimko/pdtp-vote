import React, { Component } from 'react';
import { compose } from 'recompose';

import CampaignTabVoteNowForm from './campaignTabVoteNowForm';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles } from '@material-ui/core/styles';

import Skeleton from '@material-ui/lab/Skeleton';
 
import { withFirebase } from '../../../../../../firebase';

const styles = theme => ({
  list: {
    width: '100%',
  },
});

const INITIAL_STATE = {
  allCandidates: [],
  choice: '',
  loading: true,
}

class CampaignTabVoteNowBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { id, enqueueSnackbar } = this.props;

    this.props.firebase
      .candidates(id)
      .get()
      .then((querySnapshot) => {
        let allCandidates = [];
        querySnapshot.forEach((doc) => {
          allCandidates.push({
            id: doc.id,
            name: doc.data().name,
            age: doc.data().age,
            gender:  doc.data().gender,
            organizationDeployed: doc.data().organizationDeployed,
            locationDeployed:  doc.data().locationDeployed,
            manifesto:  doc.data().manifesto,
          });
        });

        this.setState({ 
          allCandidates,
          loading: false,
        });

      }, (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { classes, id } = this.props;

    const { allCandidates, loading } = this.state;
    return(
      <React.Fragment>
        {loading ? (

          <List className={classes.list}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Avatar">
                  <Skeleton variant="circle" width={40} height={40} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton variant="text" width="30%" />}
                secondary={
                  <React.Fragment>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" />
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>

        ) : (

          <CampaignTabVoteNowForm id={id} allCandidates={allCandidates} />

        )}
      </React.Fragment>
    );
  }
}

const CampaignTabVoteNow = compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(CampaignTabVoteNowBase);

export default CampaignTabVoteNow;

export { CampaignTabVoteNowForm };