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
  const [isAttack, setIsAttack] = useState(false)
  let timeoutId = null
  useEffect(() => {
    if (match.params.classroomId) {
      let unsubscribeBoss = null
      const unsubsClassroom = getClassroomDoc(match.params.classroomId).onSnapshot(doc => {
        const newClassroomData = doc.data() || {}
        newClassroomData.id = doc.id

        setClassroomData(newClassroomData)

        unsubscribeBoss = getBossDoc(newClassroomData.bossId).onSnapshot(doc => {
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
      <img className={styles.classroomBG} src={images.bossFightBG} alt="classroom background" />
      <View absolute right={30} bottom={30} zIndex={2}>
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
      <View absolute left={30} bottom={30} zIndex={2}>
        <Button
          onClick={() => {
            window.location.href = '/classroom/' + match.params.classroomId
          }}
        >
          Back
        </Button>
      </View>
      <View alignCenter>
        <View ml={50} bold color="yellow" fontSize={24}>
          {classroomData.bossCurrentHealth <= 0 && 'Congratulations '} {bossData.name}{' '}
          {classroomData.bossCurrentHealth <= 0 && ' is now dead'}
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
            new Audio(require('sounds').attack).play()
            setIsAttack(true)
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
              setIsAttack(false)
            }, 300)
            getClassroomDoc(match.params.classroomId).update({
              bossCurrentHealth: classroomData.bossCurrentHealth - 10,
            })
          }}
        >
          Attack Boss (-30 Energy)
        </Button>
      </View>

      <View pointerEvents="none" absoluteFill>
        <Select selector={dispatch.user.getId}>
          {userId => {
            return Object.values(studentsData).map((student, index) => {
              return (
                <Character
                  key={student.id}
                  isAttack={isAttack && student.id === userId}
                  index={index}
                  {...student}
                  isBossDead={classroomData.bossCurrentHealth <= 0}
                />
              )
            })
          }}
        </Select>
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

  const isAttack = props.isAttack

  return (
    <View
      className={props.isBossDead && styles.bounce}
      pointerEvents="none"
      absolute
      left={isAttack ? '50%' : 5 + 8 * (props.index % 9) + '%'}
      bottom={isAttack ? '50%' : props.index < 9 ? '20%' : '5%'}
      style={{ transition: 'all .3s ease' }}
    >
      <View absolute alignCenter textCenter left={0} right={0} top={-20} bold color="#FED04A" fontSize={14}>
        {!!props.characterName && props.characterName.toUpperCase()}
      </View>
      {!!skinItem.imageUrl && <img src={skinItem.imageUrl} alt="skin" style={{ width: 100 }} />}
      {!!eyeItem.imageUrl && <img src={eyeItem.imageUrl} alt="eye" style={{ width: 100, position: 'absolute' }} />}
      {!!cheekItem.imageUrl && (
        <img src={cheekItem.imageUrl} alt="cheek" style={{ width: 100, position: 'absolute' }} />
      )}
      {!!mouthItem.imageUrl && (
        <img src={mouthItem.imageUrl} alt="mouth" style={{ width: 100, position: 'absolute' }} />
      )}
      {!!costumeItem.imageUrl && (
        <img src={costumeItem.imageUrl} alt="costume" style={{ width: 100, position: 'absolute' }} />
      )}
      {!!hairItem.imageUrl && <img src={hairItem.imageUrl} alt="hair" style={{ width: 100, position: 'absolute' }} />}
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
  bounce: css({
    animation: 'bounce 0.5s infinite',
    '@keyframes bounce': {
      '0%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(-50px)',
      },
    },
  }),
}
