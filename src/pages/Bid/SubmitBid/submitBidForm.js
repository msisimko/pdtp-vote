import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class SubmitBidForm extends Component {
  render() {
    return(
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>Form goes here.</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default SubmitBidForm;
