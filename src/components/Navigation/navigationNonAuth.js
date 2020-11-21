import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import * as ROUTES from '../../constants/routes';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  leftDrawer: {
    width: 250,
    flexShrink: 0,
  },
  leftDrawerPaper: {
    width: 250,
  },
  leftDrawerContainer: {
    overflow: 'auto',
  },
  bottomDrawer: {
    width: 'auto',
  },
});

class NavigationNonAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: false,
      bottom: false,
    };

    this.toggleTheme = this.toggleTheme.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  // Toggle theme between light or dark
  // on:  src/app.js
  // via: src/navigation/index.js
  toggleTheme() {
    this.props.onHandleToggleTheme();
  }

  toggleDrawer(anchor, open, event) {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({ [anchor]: open });
  };

  render() {
    const { classes, theme } = this.props;

    const { left, bottom } = this.state;

    /**
     * The links for the Navigation Drawer
     */
    const drawerLinks = (
      <List component="nav" subheader={<ListSubheader color="inherit" disableSticky={true}>Menu</ListSubheader>}>
        <ListItem button component={NavLink} exact={true} to={ROUTES.LANDING} activeClassName="Mui-selected" aria-label="Home">
          <ListItemText primary="Home" />
        </ListItem>
      </List>
    );

    return(
      <React.Fragment>
        
        <AppBar position="fixed" color="primary" className={classes.appBar} elevation={0}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} onClick={(e) => this.toggleDrawer('left', true, e)} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>Kura</Typography>
            <IconButton onClick={this.toggleTheme} color="inherit" aria-label="Toggle Theme">
              {theme === 'light' ? <Brightness4Icon /> : <BrightnessHighIcon />}
            </IconButton>
            <IconButton edge="end" onClick={(e) => this.toggleDrawer('bottom', true, e)} color="inherit" aria-label="Sign In">
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Left drawer */}
        <Drawer anchor="left" open={left} onClose={(e) => this.toggleDrawer('left', false, e)}>
          <div className={classes.leftDrawer} role="presentation" onClick={(e) => this.toggleDrawer('left', false, e)} onKeyDown={(e) => this.toggleDrawer('left', false, e)}>
            {drawerLinks}
          </div>
        </Drawer>
        
        {/* Bottom drawer */}
        <Drawer anchor="bottom" open={bottom} onClose={(e) => this.toggleDrawer('bottom', false, e)}>
          <div className={classes.bottomDrawer} role="presentation" onClick={(e) => this.toggleDrawer('bottom', false, e)} onKeyDown={(e) => this.toggleDrawer('bottom', false, e)}>
            <List component="nav" subheader={<ListSubheader color="inherit">Sign in to your account.</ListSubheader>}>
              <ListItem button component={NavLink} exact={true} to={ROUTES.SIGN_IN} activeClassName="Mui-selected" aria-label="Sign In">
                <ListItemText primary="Sign In" />
              </ListItem>
            </List>
          </div>
        </Drawer>

      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NavigationNonAuth);
