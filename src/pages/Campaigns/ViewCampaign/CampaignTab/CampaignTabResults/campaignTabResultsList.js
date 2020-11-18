import React, { Component } from 'react';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
 
import { withFirebase } from '../../../../../firebase';

const styles = theme => ({
  p: {
    fontWeight: 900,
  },
});

const INITIAL_STATE = {
  candidates: {},
  loading: true,
}

class CampaignTabResultsListBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }

  render() {
    const { classes } = this.props;

    return(
      <React.Fragment>
        <p className={classes.p}>Coming Soon!</p>
      </React.Fragment>
    );
  }
}

const CampaignTabResultsList = compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(CampaignTabResultsListBase);

export default CampaignTabResultsList;
