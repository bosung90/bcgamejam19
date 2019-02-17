import firebase from 'firebase'
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABSE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}
firebase.initializeApp(config)

export const auth = firebase.auth()

const firestore = firebase.firestore()

export const DELETE_FIELD_VALUE = firebase.firestore.FieldValue.delete()

export { firestore }

export const getClassroomsCollection = () => firestore.collection('Classrooms')
export const getClassroomDoc = classroomId => firestore.collection('Classrooms').doc(classroomId)
export const getUsersCollection = () => firestore.collection('Users')
export const getUserDocument = userId => firestore.collection('Users').doc(userId)
export const getClassroomStudentsCollection = classroomId =>
  firestore
    .collection('Classrooms')
    .doc(classroomId)
    .collection('Students')

export const getClassroomStudentDocument = (classroomId, studentId) =>
  firestore
    .collection('Classrooms')
    .doc(classroomId)
    .collection('Students')
    .doc(studentId)

export const getItemsCollection = () => firestore.collection('Items')
