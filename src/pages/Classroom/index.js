import React, { useEffect, useState } from 'react'
import { getClassroomDoc, getClassroomStudentsCollection } from 'firebase/config'
import { auth } from 'firebase/config'
import { View } from 'components'
import * as images from 'images'
import { css } from 'emotion'

export default function Classroom({ match }) {
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
      <View fill p={10}>
        <View row alignCenter>
          Welcome to {classroomData.name}{' '}
          <button
            className={styles.logoutButton}
            onClick={() => {
              auth.signOut().then(() => {
                window.location.href = '/'
              })
            }}
          >
            Logout
          </button>
        </View>
        <View>
          {Object.values(studentsData).map(student => {
            return <View>{student.characterName}</View>
          })}
        </View>
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
