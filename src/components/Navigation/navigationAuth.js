import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { compose } from 'recompose';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import FaceIcon from '@material-ui/icons/Face';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { withFirebase } from '../../firebase';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

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

class NavigationAuthBase extends Component {
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
    const { classes, firebase, theme, authUser } = this.props;

    const { left, bottom } = this.state;
    
    return(
      <React.Fragment>

        <AppBar position="fixed" color="primary" className={classes.appBar} elevation={0}>
          <Toolbar>
            <Hidden lgUp>
              <IconButton edge="start" className={classes.menuButton} onClick={(e) => this.toggleDrawer('left', true, e)} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography variant="h6" className={classes.title}>PDTP Kura</Typography>
            <IconButton onClick={this.toggleTheme} color="inherit" aria-label="Toggle Theme">
              {theme === 'light' ? <Brightness4Icon /> : <BrightnessHighIcon />}
            </IconButton>
            <IconButton edge="end" onClick={(e) => this.toggleDrawer('bottom', true, e)} color="inherit" aria-label="Sign In">
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Left drawer */}
        <Hidden mdDown>
          <Drawer className={classes.leftDrawer} variant="permanent" classes={{ paper: classes.leftDrawerPaper, }}>
            <Toolbar />
            <div className={classes.leftDrawerContainer}>
              <List component="nav" subheader={<ListSubheader color="inherit" disableSticky={true}>Menu</ListSubheader>}>
                <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.HOME} activeClassName="Mui-selected" aria-label="Home">
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.CAMPAIGNS} activeClassName="Mui-selected" aria-label="Campains">
                  <ListItemText primary="Campaigns" />
                </ListItem>
                <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.ACCOUNT} activeClassName="Mui-selected" aria-label="Account">
                  <ListItemText primary="Account" />
                </ListItem>
                <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.SETTINGS} activeClassName="Mui-selected" aria-label="Settings">
                  <ListItemText primary="Settings" />
                </ListItem>
                {!!authUser.roles[ROLES.ADMINISTRATOR] && (
                  <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.ADMINISTRATOR} activeClassName="Mui-selected" aria-label="Administrator">
                    <ListItemText primary="Administrator" />
                  </ListItem>
                )}
              </List>
            </div>
          </Drawer>
        </Hidden>

        <Hidden lgUp>
          <Drawer anchor="left" open={left} onClose={(e) => this.toggleDrawer('left', false, e)}>
            <div className={classes.leftDrawer} role="presentation" onClick={(e) => this.toggleDrawer('left', false, e)} onKeyDown={(e) => this.toggleDrawer('left', false, e)}>
              <List component="nav" subheader={<ListSubheader color="inherit" disableSticky={true}>Menu</ListSubheader>}>
                <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.HOME} activeClassName="Mui-selected" aria-label="Home">
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.CAMPAIGNS} activeClassName="Mui-selected" aria-label="Campains">
                  <ListItemText primary="Campaigns" />
                </ListItem>
                <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.ACCOUNT} activeClassName="Mui-selected" aria-label="Account">
                  <ListItemText primary="Account" />
                </ListItem>
                <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.SETTINGS} activeClassName="Mui-selected" aria-label="Settings">
                  <ListItemText primary="Settings" />
                </ListItem>
                {!!authUser.roles[ROLES.ADMINISTRATOR] && (
                  <ListItem button onClick={(e) => this.toggleDrawer('left', false, e)} component={NavLink} exact={true} to={ROUTES.ADMINISTRATOR} activeClassName="Mui-selected" aria-label="Administrator">
                    <ListItemText primary="Administrator" />
                  </ListItem>
                )}
              </List>
            </div>
          </Drawer>
        </Hidden>

        {/* Bottom drawer */}
        <Drawer anchor="bottom" open={bottom} onClose={(e) => this.toggleDrawer('bottom', false, e)}>
          <div className={classes.bottomDrawer} role="presentation" onClick={(e) => this.toggleDrawer('bottom', false, e)} onKeyDown={(e) => this.toggleDrawer('bottom', false, e)}>
            <List component="nav" subheader={<ListSubheader color="inherit">You are signed in to your account.</ListSubheader>}>
              <ListItem divider>
                <ListItemIcon>
                  <FaceIcon />
                </ListItemIcon>
                <ListItemText primary={authUser.email} secondary={authUser.uid} />
              </ListItem>
              <ListItem button onClick={firebase.doSignOut} aria-label="Sign Out">
                <ListItemText primary="Sign Out" />
              </ListItem>
            </List>
          </div>
        </Drawer>

      </React.Fragment>
    );
  }
}

const NavigationAuth = compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(NavigationAuthBase);

export default NavigationAuth;
