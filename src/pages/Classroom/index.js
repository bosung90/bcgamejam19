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
      </View>
      <View pointerEvents="none" absoluteFill>
        <Select selector={dispatch.user.getId}>
          {userId => {
            const studentsArr = Object.values(studentsData)
            return studentsArr.map((student, index) => {
              if (student.id === userId) {
                return <MyCharacter key={student.id} {...student} />
              }
              return <Character key={student.id} index={index} {...student} />
            })
          }}
        </Select>
      </View>
    </View>
  )
}

function MyCharacter(props) {
  const skinItem = dispatch.items.getItems()[props.skinId] || {}
  const eyeItem = dispatch.items.getItems()[props.eyeId] || {}
  const cheekItem = dispatch.items.getItems()[props.cheekId] || {}
  const mouthItem = dispatch.items.getItems()[props.mouthId] || {}
  const costumeItem = dispatch.items.getItems()[props.costumeId] || {}
  const hairItem = dispatch.items.getItems()[props.hairId] || {}
  return (
    <View pointerEvents="none" absolute left={0} right={0} bottom={'33%'} alignCenter>
      {!!skinItem.imageUrl && <img src={skinItem.imageUrl} alt="skin" style={{ width: 200 }} />}
      {!!eyeItem.imageUrl && <img src={eyeItem.imageUrl} alt="eye" style={{ width: 200, position: 'absolute' }} />}
      {!!cheekItem.imageUrl && (
        <img src={cheekItem.imageUrl} alt="cheek" style={{ width: 200, position: 'absolute' }} />
      )}
      {!!mouthItem.imageUrl && (
        <img src={mouthItem.imageUrl} alt="mouth" style={{ width: 200, position: 'absolute' }} />
      )}
      {!!costumeItem.imageUrl && (
        <img src={costumeItem.imageUrl} alt="costume" style={{ width: 200, position: 'absolute' }} />
      )}
      {!!hairItem.imageUrl && <img src={hairItem.imageUrl} alt="hair" style={{ width: 200, position: 'absolute' }} />}
    </View>
  )
}

function Character(props) {
  const skinItem = dispatch.items.getItems()[props.skinId] || {}
  const eyeItem = dispatch.items.getItems()[props.eyeId] || {}
  const cheekItem = dispatch.items.getItems()[props.cheekId] || {}
  const mouthItem = dispatch.items.getItems()[props.mouthId] || {}
  const costumeItem = dispatch.items.getItems()[props.costumeId] || {}
  const hairItem = dispatch.items.getItems()[props.hairId] || {}

  return (
    <View pointerEvents="none" absolute left={5 + 8 * (props.index % 8) + '%'} bottom={props.index < 9 ? '20%' : '5%'}>
      {!!skinItem.imageUrl && <img src={skinItem.imageUrl} alt="skin" style={{ width: 90 }} />}
      {!!eyeItem.imageUrl && <img src={eyeItem.imageUrl} alt="eye" style={{ width: 90, position: 'absolute' }} />}
      {!!cheekItem.imageUrl && <img src={cheekItem.imageUrl} alt="cheek" style={{ width: 90, position: 'absolute' }} />}
      {!!mouthItem.imageUrl && <img src={mouthItem.imageUrl} alt="mouth" style={{ width: 90, position: 'absolute' }} />}
      {!!costumeItem.imageUrl && (
        <img src={costumeItem.imageUrl} alt="costume" style={{ width: 90, position: 'absolute' }} />
      )}
      {!!hairItem.imageUrl && <img src={hairItem.imageUrl} alt="hair" style={{ width: 90, position: 'absolute' }} />}
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
