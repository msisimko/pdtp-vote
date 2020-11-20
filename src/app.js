import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { Navigation } from './components/Navigation';
import { Separator } from './components/Separator';

import Account from './pages/Account';
import Action from './pages/Action';
import Administrator from './pages/Administrator';
import Elections from './pages/Elections';
import ElectionEdit from './pages/Elections/Edit';
import ElectionView from './pages/Elections/View';
import Home from './pages/Home';
import Landing from './pages/Landing';
import PasswordForget from './pages/PasswordForget';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

// Imports the createMuiTheme() method that allows us
// to customize the default theme & the ThemeProvider
// component for injecting the theme into the application.
// See: https://material-ui.com/customization/default-theme/
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import LuxonUtils from '@date-io/luxon';

import { SnackbarProvider } from 'notistack';

import { withAuthentication } from './session';

import * as ROUTES from './constants/routes';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflowX: 'hidden',
  },
});

// Using the createMuiTheme() method, we declare the light theme
const light = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#0015bc',
    },
    secondary: {
      main: '#ff0000',
    },
    background: {
      default: '#e6ecf0',
    },
  },
  overrides: {
    MuiFormHelperText: {
      contained: {
        marginLeft: 0,
        marginRight: 0,
      },
    }
  },
});

// Using the createMuiTheme() method, we declare the dark theme
const dark = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#670000',
    },
  },
  overrides: {
    MuiFormHelperText: {
      contained: {
        marginLeft: 0,
        marginRight: 0,
      },
    }
  },
});

class AppBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: localStorage.getItem('theme'), // Get current theme from localStorage
    };

    this.toggleTheme = this.toggleTheme.bind(this);
  }

  componentDidMount() {
    const { theme } = this.state;

    // If theme has not yet been set in localStorage, 
    // set light theme as the default theme
    if (theme === null) {
      localStorage.setItem('theme', 'light');
      this.setState({ theme: 'light' });
    }
  }

  toggleTheme() {
    const { theme } = this.state;

    if (theme === 'light') {
      // If theme is light, change to dark
      localStorage.setItem('theme', 'dark');
      this.setState({ theme: 'dark' });
    } else { 
      // if theme is dark, change to light
      localStorage.setItem('theme', 'light');
      this.setState({ theme: 'light' });
    }
  }

  render() {
    const { classes } = this.props;
    
    const { theme } = this.state;

    const notistackRef = React.createRef();

    const onClickDismiss = key => () => { 
        notistackRef.current.closeSnackbar(key);
    }

    return(
      <ThemeProvider theme={theme === 'light' ? light : dark}>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
      <SnackbarProvider preventDuplicate maxSnack={3} autoHideDuration={1800} disableWindowBlurListener={true} ref={notistackRef} action={(key) => ( <Button size="small" onClick={onClickDismiss(key)}>Dismiss</Button> )}>
        
        <div className={classes.root}>
          
          <CssBaseline />
          
          {/* The rest of the application */}
          
          <Router>

            {/**
              * Lifting State Up technique 
              * 
              * i.e. passing of function toggleTheme() as
              * prop to be updated by Navigation element
              *  
              * More: https://reactjs.org/docs/lifting-state-up.html
              */}
            <Navigation theme={theme} onToggleTheme={this.toggleTheme} />

            <main className={classes.content}>
              
              <div className={classes.toolbar} />
              
              <Separator />
              
              <Container maxWidth="md" disableGutters>
                <Route path={ROUTES.ACCOUNT} component={Account} />
                <Route path={ROUTES.ACTION} component={Action} />
                <Route path={ROUTES.ADMINISTRATOR} component={Administrator} />
                <Route path={ROUTES.ELECTIONS} component={Elections} />
                <Route path={`${ROUTES.ELECTION_EDIT}/:id`} component={ElectionEdit} />
                <Route path={`${ROUTES.ELECTION_VIEW}/:id`} component={ElectionView} />
                <Route path={ROUTES.HOME} component={Home} />
                <Route exact path={ROUTES.LANDING} component={Landing} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
                <Route path={ROUTES.SETTINGS} component={Settings} />
                <Route path={ROUTES.SIGN_IN} component={SignIn} />
                <Route path={ROUTES.SIGN_UP} component={SignUp} />
              </Container>

              <Separator />

            </main>
            
          </Router>

        </div>

      </SnackbarProvider>
      </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
  }
}

const App = compose(
  withStyles(styles, { withTheme: true }),
  withAuthentication,
)(AppBase);

export default App;
