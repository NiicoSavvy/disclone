import firebase from './firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const database = firebase.database(); // Gets the Database service for the default app or a given app.
const ref = firebase.database().ref(); // refrence to the root location of the database.
const firebaseAuth = firebase.auth(); // Gets the Auth service for the app.
const storageRef = firebase.storage().ref(); // Points to the root storage reference.

export { database, ref, firebaseAuth, storageRef, firebase };
