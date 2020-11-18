import React, { Component } from 'react';
import { compose } from 'recompose';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import PersonIcon from '@material-ui/icons/Person';

import Skeleton from '@material-ui/lab/Skeleton';
 
import { withFirebase } from '../../../../../../firebase';

const styles = theme => ({
  list: {
    width: '100%',
  },
  inline: {
    display: 'inline',
    textTransform: 'capitalize',
  },
});

const INITIAL_STATE = {
  allCandidates: [],
  loading: true,
}

class CampaignTabVoteCandidatesBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { id, enqueueSnackbar } = this.props;

    this.listener = this.props.firebase
                      .candidates(id)
                      .onSnapshot((querySnapshot) => {
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

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { classes } = this.props;

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

          <List className={classes.list}>

            {allCandidates.map((candidate) => (
              <ListItem key={candidate.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={candidate.name}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={candidate.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {candidate.age} &bull; {candidate.gender} &mdash; {candidate.organizationDeployed}, {candidate.locationDeployed}
                      </Typography>
                      <br />
                      {candidate.manifesto}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}

          </List>

        )}
      </React.Fragment>
    )
  }
}

const CampaignTabVoteCandidates = compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(CampaignTabVoteCandidatesBase);

export default CampaignTabVoteCandidates;
