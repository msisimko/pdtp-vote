import React, { Component } from 'react';
import { compose } from 'recompose';

import SubmitBidForm from './submitBidForm';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withAuthorization, withEmailVerification } from '../../../session';

class SubmitBidBase extends Component {
  render() {
    const { theme } = this.props;

    return(
      <Accordion elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
          <Box p={1}>
            <Typography style={{ flexBasis: '33.33%', flexShrink: 0 }} variant="h6">Eyeing a seat?</Typography>
            <Typography style={{ color: theme.palette.text.secondary }} variant="subtitle1">Click here to get started with submitting your bid.</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
              
          <SubmitBidForm />
              
        </AccordionDetails>
      </Accordion>
    )
  }
}

const condition = authUser => !!authUser;

const SubmitBid = compose(
  withAuthorization(condition),
  withEmailVerification,
)(SubmitBidBase);

export default SubmitBid;