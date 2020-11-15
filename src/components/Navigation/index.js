import React, { Component } from 'react';

import NavigationAuth from './navigationAuth';
import NavigationNonAuth from './navigationNonAuth';

import { AuthUserContext } from '../../session';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.handleToggleTheme = this.handleToggleTheme.bind(this);
  }

  // Using Lifting State Up technique this function is to be
  // called by a NavigationAuth / NavigationNonAuth element
  handleToggleTheme() {
   this.props.onToggleTheme();
  } 

  render() {
    const { theme } = this.props;

    return(
      <React.Fragment>
        <AuthUserContext.Consumer>
          {authUser => 
            authUser ?
              // Pass handleToggleTheme() function i.e. Lifting State Up technique & authUser as props
              <NavigationAuth theme={theme} onHandleToggleTheme={this.handleToggleTheme} authUser={authUser} /> 
            :
              // Pass handleToggleTheme() function as prop i.e. Lifting State Up technique
              <NavigationNonAuth theme={theme} onHandleToggleTheme={this.handleToggleTheme} />
          }
        </AuthUserContext.Consumer>
      </React.Fragment>
    );
  }
}

export default Navigation;

export { NavigationAuth, NavigationNonAuth };
