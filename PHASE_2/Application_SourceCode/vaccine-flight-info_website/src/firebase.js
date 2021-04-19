import firebase from "firebase/app"
import "firebase/auth"

var firebaseConfig = {
    apiKey: "AIzaSyB2BT5PcLAlDxhVl2E7xcusZQFgOWiaqko",
    authDomain: "seng3011-306108.firebaseapp.com",
    databaseURL: "https://seng3011-306108-default-rtdb.firebaseio.com",
    projectId: "seng3011-306108",
    storageBucket: "seng3011-306108.appspot.com",
    messagingSenderId: "636133865006",
    appId: "1:636133865006:web:50ce32b29703fc8b27d1bf",
    measurementId: "G-XGW2Y03412"
  };
const app = firebase.initializeApp(firebaseConfig)
  
export const auth = app.auth()
export default app