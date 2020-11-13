import React, { Component } from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class Actions extends Component {
  render() {
    return(
      <Paper elevation={0} square>
        <Box p={3}>
          <Typography>This is the Actions sidebar.</Typography>
        </Box>
      </Paper>
    );
  }
}

export default Actions;
