import React, { useEffect, useState } from 'react'
import { getClassroomDoc, getClassroomStudentsCollection } from 'firebase/config'
import { auth } from 'firebase/config'
import { Select, View } from 'components'
import * as images from 'images'
import { css } from 'emotion'
import { dispatch } from 'store'

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
            return <View key={student.id}>{student.characterName}</View>
          })}
        </View>
      </View>
      <View absoluteFill>
        <Select selector={dispatch.user.getId}>
          {userId => {
            const studentsArr = Object.values(studentsData)
            return studentsArr.map((student, index) => {
              if (student.id === userId) {
                return <MyCharacter key={student.id} skinId={student.skinId} />
              }
              return <Character key={student.id} index={index} skinId={student.skinId} />
            })
          }}
        </Select>
      </View>
    </View>
  )
}

function MyCharacter(props) {
  const skinItem = dispatch.items.getItems()[props.skinId] || {}
  return (
    <View absolute left={0} right={0} bottom={'33%'} alignCenter>
      <img src={skinItem.imageUrl} alt="skin" style={{ width: 200 }} />
    </View>
  )
}

function Character(props) {
  const skinItem = dispatch.items.getItems()[props.skinId] || {}

  return (
    <View absolute left={5 + 8 * (props.index % 8) + '%'} bottom={props.index < 9 ? '20%' : '5%'}>
      <img src={skinItem.imageUrl} alt="skin" style={{ width: 90 }} />
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
