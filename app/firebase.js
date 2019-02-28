import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyD-yRFqNXFkeIpfK_mhzZ-sxVwjzsRAnOE",
  authDomain: "spotify-party-queue.firebaseapp.com",
  databaseURL: "https://spotify-party-queue.firebaseio.com",
    projectId: "spotify-party-queue",
  storageBucket: "spotify-party-queue.appspot.com",
  messagingSenderId: "517089269705"
};
firebase.initializeApp(config);
export default firebase;
