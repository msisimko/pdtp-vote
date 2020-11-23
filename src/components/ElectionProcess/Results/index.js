import React, { Component } from 'react';
import { compose } from 'recompose';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';

import Skeleton from '@material-ui/lab/Skeleton';

import { withSnackbar } from 'notistack';
 
import { withFirebase } from '../../../firebase';

const styles = theme => ({
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
  list: {
    width: '100%',
  },
});

/**
 * Helper function to group items in an array
 * using the given key - for use to determine
 * who has won and by how much.
 * 
 * @param {*} array 
 * @param {*} key 
 */
function groupByKey(array, key) {
  return array
    .reduce((hash, obj) => {
      if(obj[key] === undefined) return hash; 
      return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
    }, {});
}

/**
 * Helper function to get the size of an object
 * i.e. to determine the number of votes per candidate
 * 
 * @param {*} obj 
 */
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

const INITIAL_STATE = {
  votes: [],
  loading: true,
}

class ResultsBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
  
  componentDidMount() {
    const { electionId, enqueueSnackbar } = this.props;

    this.props.firebase
      .votes(electionId)
      .get()
      .then((querySnapshot) => {
        
        let votes = [];

        querySnapshot.forEach((doc) => {
          votes.push({
            id: doc.id,
            candidate: doc.data().candidate,
            candidateName: doc.data().candidateName,
            runningMateName: doc.data().runningMateName,
            uuid: doc.data().uuid,
          });
        });

        this.setState({ 
          votes,
          loading: false,
        });

      }, (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }

  render() {
    const { classes } = this.props;

    const { votes, loading } = this.state;

    /**
     * Group all votes using Candidate ID
     */
    const scores = groupByKey(votes, 'candidate');

    // Initialize empty array to hold arranged scores
    let results = [];

    /**
     * For each object property & value, create a new object
     * array that is nicely arranged for mapping
     */
    for (const key in scores) {
      results.push({
        id: key,                                                  // Candidate's ID
        candidateName: scores[key][0]['candidateName'],           // Candidate's name
        runningMateName: scores[key][0]['runningMateName'],       // Running Mate's name
        totalVotes: Object.size(scores[key]),                     // Candidate's total votes
        voters: scores[key],                                      // Voters who voted for candidate
      })
    }

    /**
     * Sort results using 'totalVotes' in descending order
     */
    results.sort((a, b) => {
      return b.totalVotes - a.totalVotes;
    });

    return(
      <Accordion defaultExpanded elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box p={1} width="100%">
            <Typography className={classes.heading} variant="h6">Results</Typography>
            <Typography className={classes.secondaryHeading} variant="subtitle1">Results</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {loading ? (
                <Skeleton variant="text" />
              ) : (
                <React.Fragment>
                  {(Object.keys(scores).length !== 0 && scores.constructor === Object) ? (

                    <List className={classes.list}>
                      {results.map((result) => (
                        <ListItem key={result.id}>
                          <ListItemAvatar>
                            <Box px={3}>
                              <AvatarGroup max={4}>
                                  <Avatar className={classes.avatar}>
                                    <PersonIcon style={{ fontSize: 60 }} />
                                  </Avatar>
                                  <Avatar className={classes.avatar}>
                                    <PersonIcon style={{ fontSize: 60 }} />
                                  </Avatar>
                              </AvatarGroup>
                            </Box>
                          </ListItemAvatar>
                          <ListItemText id={result.id} primary={result.candidateName} secondary={result.runningMateName} />
                          <ListItemSecondaryAction>
                            <Typography variant="body1">{result.totalVotes}</Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>

                  ) : (
                    <Box color="text.secondary">
                      <Typography variant="body2">There were no ballots cast in this election.</Typography>
                    </Box>
                  )}
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

const Results = compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withFirebase,
)(ResultsBase);

export default Results;
