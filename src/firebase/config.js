import firebase from 'firebase'
const config = {
  apiKey: 'AIzaSyDCLq2UNIWHHOvPnzxqjLcyH-Yal0xkGys',
  authDomain: 'bcgamejam19.firebaseapp.com',
  databaseURL: 'https://bcgamejam19.firebaseio.com',
  projectId: 'bcgamejam19',
  storageBucket: 'bcgamejam19.appspot.com',
  messagingSenderId: '460701722958',
}
firebase.initializeApp(config)

const auth = firebase.auth()

const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })

const DELETE_FIELD_VALUE = firebase.firestore.FieldValue.delete()

export { firestore, auth, DELETE_FIELD_VALUE }
