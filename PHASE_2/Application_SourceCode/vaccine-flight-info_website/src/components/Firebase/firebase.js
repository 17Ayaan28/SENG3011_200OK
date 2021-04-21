import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    "apiKey": "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
    "authDomain": "seng3011-306108.firebaseapp.com",
    "databaseURL": "https://seng3011-306108-default-rtdb.firebaseio.com",
    "storageBucket": "seng3011-306108.appspot.com"
}

class Firebase {
    constructor() {
        app.initializeApp(config);
   
        this.auth = app.auth();
        this.db = app.database();
    }

    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();
 
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    user = uid => this.db.ref(`users/${uid}`);

    database = () => {
        return this.db;
    }

    auth = () => {
        return this.auth;
    }
}
   
export default Firebase;