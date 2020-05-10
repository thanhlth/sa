require("firebase/auth");
require("firebase/firestore");

import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
var firebaseConfig = {
  apiKey: " AIzaSyC06hiKu8OuYlLIyLccXukFmcz3iHdxx8c ",
  authDomain: "sa-thanh-516bb.firebaseapp.com",
  databaseURL: "https://sa-thanh-516bb.firebaseio.com",
  projectId: "sa-thanh-516bb",
  storageBucket: "sa-thanh-516bb.appspot .com ",
  messagingSenderId: " 619232462302 ",
  appId: " 1: 619232462302: web: 16d1184ff5ed8dda48494f ",
  measurementId: " G-161PLFRMDK "
}; // Initialize Firebase   firebase . initializeApp ( firebaseConfig );   firebase .
 // Initialize Firebase
 const firebaseApp=firebase.initializeApp(firebaseConfig);

 //firebase.analytics();
 //firebaseApp.firestore().settings({timestampsInSnapshots: true })
 export default firebaseApp.firestore();
const auth = firebaseApp.auth();
const db = firebaseApp.firestore();
 // firebase utils
 const currentUser = auth.currentUser;
// firebase collections

export {
    db,
    auth,
    currentUser,
   
}