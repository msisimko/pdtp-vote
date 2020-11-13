# Boilerplate
A boilerplate (template) for Progressive Web Apps built with [ReactJS](https://reactjs.org/) + [Create React App](https://create-react-app.dev/) + [Firebase](https://firebase.google.com/) + [Material-UI](https://material-ui.com/).

### About
This boilerplate implements the bare minimum of a Progressive Web Application integrated with Firebase & Material UI. 

The boilerplate ONLY implements Firebase Authentication, including [Custom Email Action Handlers](https://firebase.google.com/docs/auth/custom-email-handler) i.e. 
- Sign In
- Sign Up
- Email Address Verification (CEAH)
- Email Address Update
- Email Address Recovery (CEAH)
- Password Forget
- Password Reset (CEAH)
- Password Update
- Profile Update (Display Name only as of this version)

The boilerplate also includes some strong authentication mechanisms that ensure a user is Signed In & has verified their email address before accessing restricted pages.

### Upcoming Features
Features currently being worked on include:
- Profile Update to include updating avatar
- Customized Authorization implementation using Firebase's [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)

### Setup on Firebase
1. Create a new Firebase project.
2. Add a Web App to your project; enable Hosting for the app.
3. Setup the following under Authentication:
  - Enable Email/Password Sign-in method.
  - In the Templates tab, set Action URL to https:://{your-domain}/action

### Setup on Dev machine

This tutorial was developed and tested on Ubuntu Desktop 20.04 LTS.

1. Install NVM, instructions can be found [here](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

2. Install Node.js & NPM as per the instructions above.

```sh
nvm install node
```

3. Install Firebase CLI (firebase-tools) and log in, instructions can be found [here](https://firebase.google.com/docs/cli).

  - To install, run

  ```sh
  curl -sL https://firebase.tools | bash
  ```

  - To log in, run

  ```sh
  firebase login
  ```

4. Clone this repository.

```sh
git clone git@github.com:msisimko/boilerplate.git
```

5. Install dependeny packages.

```sh
npm install
```

6. Initialize Firebase project.

```sh
firebase init
```

  - Select Hosting product. You may select any other product you're interested in setting up.
  - Select the default project you want Firebase to use.
  - During Hosting setup, set the following:
    - `What do you want to use as your public directory? (public) build`.
    - `Configure as a single-page app (rewrite all urls to /index.html)? yes`.

7. Create a .env file. Copy & paste the settings below into the file.

```
# firebaseConfig details
# NOTE: Remember to replace `xxxxxXXXXXxxxxx` with your actual Firebase config details, available in the Firebase project settings.
REACT_APP_API_KEY=xxxxxXXXXXxxxxx
REACT_APP_AUTH_DOMAIN=xxxxxXXXXXxxxxx
REACT_APP_DATABASE_URL=xxxxxXXXXXxxxxx
REACT_APP_PROJECT_ID=xxxxxXXXXXxxxxx
REACT_APP_STORAGE_BUCKET=xxxxxXXXXXxxxxx
REACT_APP_MESSAGING_SENDER_ID=xxxxxXXXXXxxxxx
REACT_APP_APP_ID=xxxxxXXXXXxxxxx

# email verification redirect e.g. localhost for local development
REACT_APP_CONFIRM_EMAIL_REDIRECT=http://localhost:3000

# Create React App development settings
# For more: https://create-react-app.dev/docs/advanced-configuration/
# BROWSER=none
```

8. Create a .env.production file. Copy & paste the settings below into the file.

```
# firebaseConfig details
# NOTE: Remember to replace `xxxxxXXXXXxxxxx` with your actual Firebase config details, available in the Firebase project settings.
REACT_APP_API_KEY=xxxxxXXXXXxxxxx
REACT_APP_AUTH_DOMAIN=xxxxxXXXXXxxxxx
REACT_APP_DATABASE_URL=xxxxxXXXXXxxxxx
REACT_APP_PROJECT_ID=xxxxxXXXXXxxxxx
REACT_APP_STORAGE_BUCKET=xxxxxXXXXXxxxxx
REACT_APP_MESSAGING_SENDER_ID=xxxxxXXXXXxxxxx
REACT_APP_APP_ID=xxxxxXXXXXxxxxx

# email verification redirect e.g. localhost for local development
# NOTE: Remember to replace `https://{your-domain}` with your actual live production website URL.
REACT_APP_CONFIRM_EMAIL_REDIRECT=https://{your-domain}
```

9. Happy coding!
