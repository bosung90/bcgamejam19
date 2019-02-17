import React, { useEffect, useState } from 'react'
import {
  getClassroomDoc,
  getClassroomStudentsCollection,
  getClassroomStudentDocument,
  getUsersCollection,
  getUserDocument,
} from 'firebase/config'
import { Button, View } from 'components'
import * as images from 'images'
import { css } from 'emotion'

export default function Teachers({ match }) {
  const [classroomData, setClassroomData] = useState({})
  const [studentsData, setStudentsData] = useState({})
  useEffect(() => {
    if (match.params.classroomId) {
      const unsubsClassroom = getClassroomDoc(match.params.classroomId).onSnapshot(doc => {
        const classroomData = doc.data() || {}
        classroomData.id = doc.id
        setClassroomData(classroomData)
      })
      const unsubsClassroomStudents = getClassroomStudentsCollection(match.params.classroomId).onSnapshot(docs => {
        const studentsData = {}
        docs.forEach(doc => {
          studentsData[doc.id] = doc.data()
          studentsData[doc.id].id = doc.id
        })
        setStudentsData(studentsData)
      })
      return () => {
        unsubsClassroom()
        unsubsClassroomStudents()
      }
    }
  }, [])
  return (
    <View fill color="white">
      <img className={styles.classroomBG} src={images.classroomBG} alt="classroom background" />
      <View center fill>
        <Button
          onClick={() => {
            getClassroomDoc(match.params.classroomId).update({
              bossCurrentHealth: 1000,
            })
          }}
        >
          Reset Boss
        </Button>
        <View h={50} />
        <Button
          onClick={() =>
            getClassroomDoc(match.params.classroomId).update({
              xp: 0,
            })
          }
        >
          Reset Class XP
        </Button>
        <Button
          onClick={() => {
            getClassroomStudentsCollection(match.params.classroomId)
              .get()
              .then(docs => {
                docs.forEach(doc => {
                  getClassroomStudentDocument(match.params.classroomId, doc.id).delete()
                })
              })

            getUsersCollection()
              .get()
              .then(docs => {
                docs.forEach(doc => {
                  getUserDocument(doc.id).delete()
                })
              })
          }}
        >
          Reset Users and Students
        </Button>
      </View>
    </View>
  )
}

const styles = {
  classroomBG: css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -100,
  }),
  logoutButton: css({
    width: 100,
    height: 36,
    cursor: 'pointer',
    backgroundColor: 'purple',
    color: 'white',
    borderRadius: 50,
    fontWeight: 'bold',
    fontSize: 16,
    padding: 6,
  }),
}
