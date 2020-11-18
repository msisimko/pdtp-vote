import React, { Component } from 'react';
import { compose } from 'recompose';

import CampaignTabAbout from './CampaignTabAbout';
import CampaignTabSubmitBid from './CampaignTabSubmitBid';
import CampaignTabVote from './CampaignTabVote';
import CampaignTabResults from './CampaignTabResults';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import BeenhereIcon from '@material-ui/icons/Beenhere';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import InfoIcon from '@material-ui/icons/Info';
import PublishIcon from '@material-ui/icons/Publish';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

function TabContainer(props) {
  return (
    <div>
      {props.children}
    </div>
  );
}

class CampaignTabBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { value: parseFloat( this.props.tab ) };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  render() {
    const { id, classes } = this.props;

    const { value } = this.state;

    return(
      <div className={classes.tabs}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="on"
          >
            <Tab label="About" icon={<InfoIcon />} />
            <Tab label="Submit Bid" icon={<PublishIcon />} />
            <Tab label="Cast Vote" icon={<HowToVoteIcon />} />
            <Tab label="Results" icon={<BeenhereIcon />} />
          </Tabs>
        </AppBar>
        
        {/* About Election Campaign */}
        {value === 0 && 
          <TabContainer>
            <CampaignTabAbout id={id} />
          </TabContainer>
        }

        {/* About Election Campaign */}
        {value === 1 && 
          <TabContainer>
            <CampaignTabSubmitBid id={id} />
          </TabContainer>
        }

        {/* Vote */}
        {value === 2 && 
          <TabContainer>
            <CampaignTabVote id={id} />
          </TabContainer>
        }

        {/* Election Results */}
        {value === 3 && 
          <TabContainer>
            <CampaignTabResults id={id} />
          </TabContainer>
        }
      </div>
    );
  }
}

const CampaignTab = compose(
  withStyles(styles, { withTheme: true }),
)(CampaignTabBase);

export default CampaignTab;

export { CampaignTabAbout, CampaignTabSubmitBid, CampaignTabVote, CampaignTabResults };
