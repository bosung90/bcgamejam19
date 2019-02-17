import React, { useEffect, useState } from 'react'
import { getClassroomDoc, getClassroomStudentsCollection, getBossDoc } from 'firebase/config'
import { auth } from 'firebase/config'
import { Button, Select, View } from 'components'
import * as images from 'images'
import { css } from 'emotion'
import { dispatch } from 'store'

let eyeIndex = 0
let mouthIndex = 0
let cheekIndex = 0
let hairIndex = 0
let skinIndex = 0
let costumeIndex = 0

export default function BossFight({ match }) {
  const [classroomData, setClassroomData] = useState({})
  const [bossData, setBossData] = useState({})
  const [studentsData, setStudentsData] = useState({})
  useEffect(() => {
    if (match.params.classroomId) {
      let unsubscribeBoss = null
      const unsubsClassroom = getClassroomDoc(match.params.classroomId).onSnapshot(doc => {
        const classroomData = doc.data() || {}
        classroomData.id = doc.id
        setClassroomData(classroomData)

        unsubscribeBoss = getBossDoc(classroomData.bossId).onSnapshot(doc => {
          const bossD = doc.data() || {}
          bossD.id = doc.id
          setBossData(bossD)
        })
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
        unsubscribeBoss && unsubscribeBoss()
      }
    }
  }, [])
  return (
    <View fill color="white">
      <View bc={'white'} bw={2} br={40} h={35} m={15}>
        <img
          src={images.bossHealth}
          alt="boss health"
          style={{
            width: Math.min(Math.max(classroomData.bossCurrentHealth / bossData.health || 0, 0), 1) * 100 + '%',
            borderRadius: 40,
            height: 35,
            transition: 'width 0.5s',
          }}
        />
      </View>
      <img className={styles.classroomBG} src={images.classroomBG} alt="classroom background" />
      <View absolute left={30} bottom={30} zIndex={2}>
        <Button
          onClick={() => {
            auth.signOut().then(() => {
              window.location.href = '/'
            })
          }}
        >
          Logout
        </Button>
      </View>
      <View alignCenter>
        <View ml={50} bold color="yellow" fontSize={24}>
          {bossData.name}
        </View>

        <img
          className={
            Math.min(Math.max(classroomData.bossCurrentHealth / bossData.health || 0, 0), 1) < 0.5
              ? styles.dyingBoss
              : styles.animation
          }
          src={bossData.imageUrl}
          alt={bossData.name}
          style={{
            opacity: Math.min(Math.max(classroomData.bossCurrentHealth / bossData.health || 0, 0), 1),
            width: Math.min(Math.max(classroomData.bossCurrentHealth / bossData.health || 0, 0), 1) * 100 + 100,
          }}
        />
      </View>
      <View absolute bottom={30} left={0} right={0} alignCenter>
        <Button
          className={styles.animation}
          onClick={() => {
            getClassroomDoc(match.params.classroomId).update({
              bossCurrentHealth: classroomData.bossCurrentHealth - 10,
            })
          }}
        >
          Attack Boss (-30 Energy)
        </Button>
      </View>

      <View pointerEvents="none" absoluteFill>
        {Object.values(studentsData).map((student, index) => {
          return <Character key={student.id} index={index} {...student} />
        })}
      </View>
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
    zIndex: -1,
  }),
  animation: css({
    animation: 'pulsate 1s infinite',
    '@keyframes pulsate': {
      '0%': {
        transform: 'scaleX(1) scaleY(1)',
      },
      '50%': {
        transform: 'scaleX(1.05) scaleY(1.05)',
      },
    },
  }),
  dyingBoss: css({
    animation: 'pulsate 0.5s infinite',
    '@keyframes pulsate': {
      '0%': {
        transform: 'scaleX(1) scaleY(1)',
      },
      '50%': {
        transform: 'scaleX(1.05) scaleY(1.05)',
      },
    },
  }),
}
