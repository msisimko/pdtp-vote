import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  separator: {
    height: theme.spacing(2),
  },
});

class Separator extends Component {
  render() {
    const { classes, show } = this.props;

    let visible = true; // Initialize visible variable as default TRUE

    if (show === false) { // If this.props.show is set to FALSE
      visible = false; // Change variable visible to FALSE
    }

    return(
      <React.Fragment>
        { (visible) && (
          <div className={classes.separator} />
        ) }
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Separator);
