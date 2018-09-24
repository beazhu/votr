
import firebase from 'firebase'

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCXBwT6ym1k-jqbawV_MEvByL6sqD255Q4",
    authDomain: "votr-beazhu.firebaseapp.com",
    databaseURL: "https://votr-beazhu.firebaseio.com",
    projectId: "votr-beazhu",
    storageBucket: "votr-beazhu.appspot.com",
    messagingSenderId: "408624450581"
  };
  firebase.initializeApp(config);
  export default firebase;
