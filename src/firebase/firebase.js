import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }
  
  // *** Merge authUser and currentUser's ID token *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        /**
         * Get currentUser's customClaims using getIdTokenResult()
         */
        this.auth.currentUser.getIdTokenResult()
        .then((idTokenResult) => {
            /**
             * Declare an empty object called {roles}
             */
            const roles = {};

            /**
             * Check if currentUser's customClaims has administrator defined
             */
            if (!!idTokenResult.claims.administrator) {
              // If administrator defined, add it to empty {roles} object
              roles['administrator'] = idTokenResult.claims.administrator;
            }

            /**
             * Create a new authUser - merge between some authUser values & new {roles} object
             */ 
            authUser = {
              // From authUser
              uid: authUser.uid,
              displayName: authUser.displayName,
              email: authUser.email,
              emailVerified: authUser.emailVerified,  
              providerData: authUser.providerData,
              // New roles object
              roles,
            };

            next(authUser);
        });
      } else {
        fallback();
      }
    });

  // *** App API ***

  getServerTimestamp = () => app.firestore.FieldValue.serverTimestamp();
  
  // *** Auth API ***
 
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  
  doSignOut = () => 
    this.auth.signOut();

  doSendPasswordResetEmail = email => 
    this.auth.sendPasswordResetEmail(email);

  doUpdateEmail = email =>
    this.auth.currentUser.updateEmail(email);

  doUpdatePassword = password =>
    this.auth.currentUser.updatePassword(password);
  
  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRM_EMAIL_REDIRECT,
    });

  // *** Email Action Handler API ***

  doCheckActionCode = actionCode => 
    this.auth.checkActionCode(actionCode);

  doApplyActionCode = actionCode => 
    this.auth.applyActionCode(actionCode);

  doVerifyPasswordResetCode = actionCode => 
    this.auth.verifyPasswordResetCode(actionCode);

  doConfirmPasswordReset = (actionCode, password) => 
    this.auth.confirmPasswordReset(actionCode, password);
  
  // *** Firestore API ***
  
  elections = () => this.db.collection('elections');

  election = id => this.db.collection('elections').doc(id);
}

export default Firebase;
