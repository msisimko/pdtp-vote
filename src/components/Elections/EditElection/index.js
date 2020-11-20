import React, { Component } from 'react';

import EditElectionForm from './editElectionForm';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
});

class EditElection extends Component {
  render() {
    const { electionId, classes } = this.props;

    return(
      <Accordion defaultExpanded elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box p={1}>
            <Typography className={classes.heading} variant="h6">Edit Election</Typography>
            <Typography className={classes.secondaryHeading} variant="subtitle1">Update or delete this election.</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>

              <EditElectionForm electionId={electionId} />

            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default withStyles(styles, { withTheme: true })(EditElection);

